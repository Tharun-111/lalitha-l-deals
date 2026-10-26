import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Admin signs in with a username; the auth account uses a matching internal email.
export const usernameToEmail = (u: string) =>
  `${u.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "")}@lalitha.local`;

export function useAdminStatus() {
  const [state, setState] = useState<"loading" | "signedout" | "forbidden" | "admin">("loading");
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setState("signedout");
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setState(data ? "admin" : "forbidden");
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { check(); });
    return () => sub.subscription.unsubscribe();
  }, []);
  return state;
}

export async function uploadImage(file: File, folder: "products" | "offers" | "hero") {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace("jpeg", "jpg");
  if (!["jpg", "png", "webp", "gif"].includes(ext)) throw new Error("Please upload a JPG, PNG, WEBP or GIF image.");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

export async function deleteImage(path: string | null | undefined) {
  if (path) await supabase.storage.from("product-images").remove([path]);
}
