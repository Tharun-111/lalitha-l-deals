import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { usernameToEmail } from "@/lib/admin";
import { classifyLoginFailure, loginFeedback } from "@/lib/login-feedback";
import { canOpenDemo } from "@/lib/demo-preview";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Lalitha / L Deals" },
      { name: "description", content: "Shop owner sign in." },
      { property: "og:title", content: "Admin sign in — Lalitha / L Deals" },
      { property: "og:description", content: "Shop owner sign in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setErr(""); setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(username), password });
      if (error) { setErr(loginFeedback[classifyLoginFailure(error)]); return; }
      await nav({ to: "/admin" });
    } catch (error) {
      setErr(loginFeedback[classifyLoginFailure(error)]);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <div className="flex justify-center"><Logo className="h-14" /></div>
      <form onSubmit={onSubmit} aria-busy={busy} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        <div className="space-y-1.5"><Label htmlFor="u">Username</Label><Input id="u" value={username} onChange={(e) => { setUsername(e.target.value); setErr(""); }} autoComplete="username" disabled={busy} aria-describedby={err ? "login-error" : undefined} required /></div>
        <div className="space-y-1.5"><Label htmlFor="p">Password</Label><Input id="p" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErr(""); }} autoComplete="current-password" disabled={busy} aria-describedby={err ? "login-error" : undefined} required /></div>
        {err && <p id="login-error" className="text-sm text-destructive" role="alert">{err}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
      {canOpenDemo(import.meta.env.DEV) && <div className="mt-6 space-y-3 border-t border-border pt-5">
        <p className="text-sm font-semibold">DEMO / PREVIEW ONLY</p>
        <p className="text-sm text-muted-foreground">No account required. No real shop or customer data.</p>
        <Button variant="soft" className="w-full" asChild><Link to="/admin/demo">Open demo dashboard</Link></Button>
      </div>}
    </div>
  );
}
