import { supabase } from "./supabaseClient";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  published_at: string | null;
  status: string | null;
  category?: Category | null;
  tags?: { tag: Tag }[] | null;
};

export async function listPublishedPosts(limit = 20): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, summary, published_at, status, category:categories(id,name,slug), tags:post_tags(tag:tags(id,name,slug))"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("supabase listPublishedPosts error", error);
    return [];
  }
  return (data as Post[]) ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, summary, content, published_at, status, category:categories(id,name,slug), tags:post_tags(tag:tags(id,name,slug))"
    )
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("supabase getPostBySlug error", error);
    return null;
  }
  return (data as Post) ?? null;
}

export async function listPostsByCategorySlug(slug: string, limit = 20): Promise<Post[]> {
  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();
  if (catErr) {
    console.error("supabase listPostsByCategorySlug cat error", catErr);
    return [];
  }
  if (!cat) return [];
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, summary, published_at, status, category:categories(id,name,slug), tags:post_tags(tag:tags(id,name,slug))"
    )
    .eq("status", "published")
    .eq("category_id", cat.id)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("supabase listPostsByCategorySlug error", error);
    return [];
  }
  return (data as Post[]) ?? [];
}

export async function listPostsByTagSlug(slug: string, limit = 20): Promise<Post[]> {
  type LinkRow = { post_id: string };
  const { data: links, error: linkErr } = await supabase
    .from("post_tags")
    .select("post_id")
    .eq("tags.slug", slug)
    .limit(500);
  if (linkErr) {
    console.error("supabase listPostsByTagSlug link error", linkErr);
    return [];
  }
  const ids = (links ?? []).map((l: LinkRow) => l.post_id);
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, summary, published_at, status, category:categories(id,name,slug), tags:post_tags(tag:tags(id,name,slug))"
    )
    .eq("status", "published")
    .in("id", ids)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("supabase listPostsByTagSlug error", error);
    return [];
  }
  return (data as Post[]) ?? [];
}

export async function searchPosts(params: {
  q?: string;
  category?: string;
  tag?: string;
  limit?: number;
}): Promise<Post[]> {
  const { q, category, tag, limit = 50 } = params;
  let query = supabase
    .from("posts")
    .select(
      "id, slug, title, summary, content, published_at, status, category:categories(id,name,slug), tags:post_tags(tag:tags(id,name,slug))"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (q && q.trim()) {
    const kw = `%${q.trim()}%`;
    query = query.or(
      `title.ilike.${kw},summary.ilike.${kw},content.ilike.${kw}`
    );
  }
  if (category && category.trim()) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category.trim())
      .limit(1)
      .maybeSingle();
    if (cat?.id) {
      query = query.eq("category_id", cat.id);
    } else {
      return [];
    }
  }
  if (tag && tag.trim()) {
    type LinkRow = { post_id: string };
    const { data: links } = await supabase
      .from("post_tags")
      .select("post_id")
      .eq("tags.slug", tag.trim())
      .limit(1000);
    const ids = (links ?? []).map((l: LinkRow) => l.post_id);
    if (ids.length > 0) {
      query = query.in("id", ids);
    } else {
      return [];
    }
  }
  const { data, error } = await query;
  if (error) {
    console.error("supabase searchPosts error", error);
    return [];
  }
  return (data as Post[]) ?? [];
}
