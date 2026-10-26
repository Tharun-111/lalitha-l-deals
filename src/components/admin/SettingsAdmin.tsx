import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { deleteImage, uploadImage } from "@/lib/admin";
import heroDefault from "@/assets/hero.jpg";
import { F, ImagePicker, useRefresh } from "./shared";

const FIELDS = [
  ["address", "Shop address (shown in contact, footer and directions)"],
  ["maps_link", "Google Maps pin link (optional — used for the Get Directions buttons; leave blank to search by address)"],
  ["about", "About the shop"],
  ["rental_terms", "General costume rental terms (duration, returns)"],
  ["deposit_info", "Deposit information"],
  ["delivery_info", "Delivery information (areas, charges)"],
  ["frame_instructions", "Custom photo frame instructions"],
] as const;
type Key = (typeof FIELDS)[number][0];

export function SettingsAdmin() {
  const refresh = useRefresh();
  const { data, refetch } = useQuery({ queryKey: ["admin", "settings"], queryFn: async () => (await supabase.from("settings").select("*").eq("id", 1).single()).data });
  const [f, setF] = useState<Record<Key, string>>({ about: "", address: "", maps_link: "", rental_terms: "", deposit_info: "", delivery_info: "", frame_instructions: "" });
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [removeImg, setRemoveImg] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!data) return;
    setF(Object.fromEntries(FIELDS.map(([k]) => [k, data[k] ?? ""])) as Record<Key, string>);
    setAlt(data.hero_alt ?? "");
  }, [data]);

  const save = async () => {
    setBusy(true);
    try {
      const old = data?.hero_image_path ?? null;
      let hero_image_path = removeImg ? null : old;
      if (file) hero_image_path = await uploadImage(file, "hero");
      const row = Object.fromEntries(FIELDS.map(([k]) => [k, f[k].trim() || null]));
      const { error } = await supabase.from("settings")
        .update({ ...row, hero_image_path, hero_alt: alt.trim() || null, updated_at: new Date().toISOString() }).eq("id", 1);
      if (error) throw error;
      if (old && old !== hero_image_path) await deleteImage(old);
      setFile(null); setRemoveImg(false);
      toast.success("Saved"); refresh(); refetch();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };

  const current = removeImg ? null : data?.hero_image_path ?? null;
  return (
    <div className="mt-4 space-y-4 rounded-2xl border border-border bg-card p-6">
      <section className="space-y-3 border-b border-border pb-6">
        <h3 className="font-medium">Homepage main image</h3>
        <ImagePicker current={current} file={file} onFile={(x) => { setFile(x); if (x) setRemoveImg(false); }} onRemove={() => setRemoveImg(true)} />
        {!current && !file && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <img src={heroDefault} alt="" className="h-12 w-16 rounded object-cover" /> The default image will be shown.
          </div>
        )}
        <F label="Image description (alt text)" id="halt"><Input id="halt" value={alt} onChange={(e) => setAlt(e.target.value)} /></F>
      </section>
      <p className="text-sm text-muted-foreground">Anything left blank is hidden on the website.</p>
      {FIELDS.map(([k, label]) => (
        <F key={k} label={label} id={k}><Textarea id={k} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></F>
      ))}
      <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
    </div>
  );
}
