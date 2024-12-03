import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  return (
    <div className="min-h-screen relative overflow-x-visible md:pb-4">
      <Header />
      <main className="pt-4 px-2 sm:px-4 h-full overflow-y-auto min-h-screen sm:min-h-full 2xl:p-0 xl:container mx-auto md:mt-4 lg:mt-6">
        <Outlet />
      </main>
      <Footer/>
      <Toaster />
    </div>
  );
}
