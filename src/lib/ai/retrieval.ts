import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { KnowledgeChunk } from "@/lib/ai/types";

let vectorStore: SupabaseVectorStore | null = null;

function getVectorStore(): SupabaseVectorStore {
  if (vectorStore) return vectorStore;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-2-preview",
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

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
