import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="px-2 sm:px-4 2xl:p-0 2xl:container mx-auto">
      <Header />
      <main className="pt-4">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
