-- Create pgvector extension for embeddings
create extension if not exists vector;

-- Create knowledge_documents table with pgvector embedding support
create table knowledge_documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(3072)
);

-- Match function for semantic search
create or replace function match_knowledge_documents(
  query_embedding vector(3072),
  match_count int default 4,
  filter jsonb default '{}'
)
returns table(
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    kd.id::bigint,
    kd.content,
    kd.metadata,
    1 - (kd.embedding <=> query_embedding) as similarity
  from knowledge_documents kd
  where (filter = '{}' or kd.metadata @> filter)
  order by kd.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create HNSW index for fast nearest-neighbor search
create index on knowledge_documents using hnsw (embedding vector_cosine_ops);

-- GIN index for metadata JSONB filtering
create index on knowledge_documents using gin (metadata);

-- Enable Row Level Security
alter table knowledge_documents enable row level security;

-- Knowledge base is publicly readable (service_role key for writes)
create policy "Knowledge base is publicly readable"
  on knowledge_documents for select
  using (true);
