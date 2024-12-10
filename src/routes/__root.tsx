import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useUser } from "@/constants/useUser";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { is_best_client } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!is_best_client && window.location.pathname === "/warehouse") {
      navigate({ to: "/", replace: true });
    }
  }, [is_best_client, navigate]);

  return (
    <div className="min-h-screen relative overflow-x-visible md:pb-4">
      <Header />
      <main className="pt-4 px-2 sm:px-4 h-full overflow-y-auto min-h-screen sm:min-h-full xl:container mx-auto md:mt-4 lg:mt-6">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
