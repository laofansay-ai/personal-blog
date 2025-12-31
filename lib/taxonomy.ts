import { supabase } from "./supabaseClient";

export type Category = { id: string; name: string; slug: string };
export type Tag = { id: string; name: string; slug: string };

export async function listAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });
  if (error) {
    console.error("supabase listAllCategories error", error);
    return [];
  }
  return (data as Category[]) ?? [];
}

export async function listAllTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, slug")
    .order("name", { ascending: true });
  if (error) {
    console.error("supabase listAllTags error", error);
    return [];
  }
  return (data as Tag[]) ?? [];
}
