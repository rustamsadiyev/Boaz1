import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/home";

export const Route = createFileRoute("/_main/")({
  component: Home,
});
