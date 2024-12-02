import Admin from "@/pages/admin";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_admin/products")({
  component: Admin,
});
