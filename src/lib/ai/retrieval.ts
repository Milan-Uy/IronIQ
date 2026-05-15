import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Embeddings } from "@langchain/core/embeddings";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { KnowledgeChunk } from "@/lib/ai/types";

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
    return Promise.all(texts.map((t) => this.embedQuery(t)));
  }
}

let vectorStore: SupabaseVectorStore | null = null;

function getVectorStore(): SupabaseVectorStore {
  if (vectorStore) return vectorStore;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const embeddings = new GeminiEmbeddings768(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

  vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: "knowledge_documents",
    queryName: "match_knowledge_documents",
  });

  return vectorStore;
}

export async function retrieveKnowledge(
  query: string,
  k = 4
): Promise<KnowledgeChunk[]> {
  try {
    if (!query.trim()) return [];

    const store = getVectorStore();
    const results = await store.similaritySearchWithScore(query, k);

    return results
      .filter(([, score]) => score >= 0.35)
      .map(([doc, score]) => ({
        content: doc.pageContent,
        source: doc.metadata.source ?? doc.metadata.title ?? "unknown",
        score,
      }));
  } catch (err) {
    console.error("[retrieval] error:", err);
    return [];
  }
}
