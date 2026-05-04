import { createClient } from "@/lib/supabase/client";
import type { Document, IRCategory, DocumentStatus } from "@/lib/types";

type DbDocument = {
  id: string;
  name: string;
  category: string;
  uploaded_at: string;
  size: number;
  status: string;
  storage_path: string | null;
};

function toDocument(row: DbDocument): Document {
  return {
    id: row.id,
    name: row.name,
    category: row.category as IRCategory,
    uploadedAt: row.uploaded_at,
    size: row.size,
    status: row.status as DocumentStatus,
    storagePath: row.storage_path ?? undefined,
  };
}

export async function getDocuments(): Promise<Document[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("uploaded_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbDocument[]).map(toDocument);
}

export async function uploadDocument(
  file: File,
  meta: { name: string; category: IRCategory }
): Promise<Document> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const path = `${user.id}/${crypto.randomUUID()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType: "application/pdf" });

  if (uploadError) throw new Error(uploadError.message);

  const { data, error } = await supabase
    .from("documents")
    .insert({
      name: meta.name,
      category: meta.category,
      uploaded_at: new Date().toISOString().slice(0, 10),
      size: file.size,
      status: "PENDING",
      storage_path: path,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toDocument(data as DbDocument);
}

export async function getDocumentUrl(storagePath: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60 * 60);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function updateDocumentStatus(
  id: string,
  status: DocumentStatus
): Promise<Document> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toDocument(data as DbDocument);
}

export async function deleteDocument(id: string, storagePath?: string): Promise<void> {
  const supabase = createClient();

  if (storagePath) {
    await supabase.storage.from("documents").remove([storagePath]);
  }

  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
