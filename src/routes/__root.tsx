import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="2xl:p-0 xl:container mx-auto min-h-screen relative overflow-x-visible pb-4">
      <Header />
      <main className="pt-4 px-2 sm:px-4 h-full overflow-y-auto min-h-screen">
        <Outlet />
      </main>
      <Footer/>
      <Toaster />
    </div>
  );
}
