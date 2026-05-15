import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
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

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

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
