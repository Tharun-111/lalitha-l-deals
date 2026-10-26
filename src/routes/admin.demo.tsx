import { createFileRoute, Navigate } from "@tanstack/react-router";
import { DemoDashboard } from "@/components/admin/DemoDashboard";
import { canOpenDemo } from "@/lib/demo-preview";

export const Route = createFileRoute("/admin/demo")({
  head: () => ({ meta: [
    { title: "Demo admin preview — Lalitha / L Deals" },
    { name: "description", content: "Development-only admin appearance preview with no real shop data." },
    { property: "og:title", content: "Demo admin preview — Lalitha / L Deals" },
    { property: "og:description", content: "Development-only admin appearance preview with no real shop data." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: () => canOpenDemo(import.meta.env.DEV) ? <DemoDashboard /> : <Navigate to="/admin/login" replace />,
});