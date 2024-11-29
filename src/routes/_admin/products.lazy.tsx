import Products from "@/pages/admin/products";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_admin/products")({
  component: Products,
});
