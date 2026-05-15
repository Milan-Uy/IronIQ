// Supabase Realtime requires WebSocket on Node < 22; stub it since we don't use Realtime here
if (typeof globalThis.WebSocket === "undefined") {
  (globalThis as unknown as Record<string, unknown>).WebSocket = class {};
}

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Embeddings } from "@langchain/core/embeddings";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

class GeminiEmbeddings768 extends Embeddings {
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>;
  constructor(apiKey: string) {
    super({});
    this.model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-embedding-001" });
  }
  async embedQuery(text: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = await this.model.embedContent({ content: { parts: [{ text }], role: "user" }, outputDimensionality: 768 } as any);
    return r.embedding.values;
  }
  async embedDocuments(texts: string[]) {
    const CHUNK = 50;
    const results: number[][] = [];
    for (let i = 0; i < texts.length; i += CHUNK) {
      if (i > 0) {
        process.stdout.write(`  rate-limit pause (65s)...\n`);
        await new Promise((r) => setTimeout(r, 65000));
      }
      const slice = texts.slice(i, i + CHUNK);
      const batch = await this.model.batchEmbedContents({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requests: slice.map((text) => ({ content: { parts: [{ text }], role: "user" }, outputDimensionality: 768 } as any)),
      });
      results.push(...batch.embeddings.map((e) => e.values));
    }
    return results;
  }
}
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const knowledgeDir = join(__dirname, "../content/knowledge");

  const files = readdirSync(knowledgeDir).filter((f) => f.endsWith(".md"));
  console.log(`Reading ${files.length} files from content/knowledge/`);

  const texts: string[] = [];
  const metadatas: Record<string, unknown>[] = [];

  for (const file of files) {
    const raw = readFileSync(join(knowledgeDir, file), "utf-8");
    const { data: frontmatter, content: body } = matter(raw);
    texts.push(body);
    metadatas.push({
      title: frontmatter.title ?? null,
      category: frontmatter.category ?? null,
      muscle_groups: frontmatter.muscle_groups ?? null,
      source: frontmatter.source ?? null,
    });
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 120,
  });

  const docs = await splitter.createDocuments(texts, metadatas);
  console.log(`Split into ${docs.length} chunks`);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const embeddings = new GeminiEmbeddings768(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

  console.log("Truncating existing knowledge_documents...");
  await supabase.from("knowledge_documents").delete().neq("id", 0);

  console.log(`Ingesting ${docs.length} chunks into Supabase...`);
  await SupabaseVectorStore.fromDocuments(docs, embeddings, {
    client: supabase,
    tableName: "knowledge_documents",
    queryName: "match_knowledge_documents",
  });

  console.log(`Done. ${docs.length} chunks ingested.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
