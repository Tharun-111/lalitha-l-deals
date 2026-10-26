import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { imageUrl } from "@/lib/shop";
import { Label } from "@/components/ui/label";

export function useAdminTable<T extends "products" | "categories" | "offers" | "orders">(table: T) {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const q = supabase.from(table).select("*");
      const { data, error } = await (table === "categories" ? q.order("sort_order") : q.order("created_at", { ascending: false }));
      if (error) throw error;
      return data as never as AdminRow<T>[];
    },
  });
}
import type { Database } from "@/integrations/supabase/types";
export type AdminRow<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

export function useRefresh() {
  const qc = useQueryClient();
  return () => { qc.invalidateQueries({ queryKey: ["admin"] }); qc.invalidateQueries({ queryKey: ["catalog"] }); };
}

export function F({ label, id, children, hint }: { label: string; id: string; children: ReactNode; hint?: string | undefined }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ImagePicker({ current, file, onFile, onRemove }: { current: string | null; file: File | null; onFile: (f: File | null) => void; onRemove: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  const src = preview ?? imageUrl(current);
  return (
    <div className="flex items-center gap-4">
      <div className="h-28 w-24 overflow-hidden rounded-lg border border-border bg-muted">
        {src && <img src={src} alt="Preview" className="h-full w-full object-contain" />}
      </div>
      <div className="space-y-2 text-sm">
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => onFile(e.target.files?.[0] ?? null)} aria-label="Upload image" />
        {(current || file) && <button type="button" className="block text-destructive underline" onClick={() => { onFile(null); onRemove(); }}>Remove image</button>}
        {preview && <p className="text-xs text-muted-foreground">New image will be saved when you click Save.</p>}
      </div>
    </div>
  );
}

export const num = (v: string) => (v.trim() === "" ? null : Number(v));
