import { Heart, LogIn, LogOut, Settings, ShoppingCart } from "lucide-react";
import ParamInput from "../param/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useStore } from "@/hooks/useStore";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useGet } from "@/hooks/useGet";
import { useUser } from "@/constants/useUser";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useConfirm } from "@/hooks/useConfirm";
import { CategoryDrawer } from "@/pages/category/category-drawer";

export default function Header() {
  const { store } = useStore<{ name: string }[]>("baskets");
  const confirm = useConfirm();
  const { username, is_admin } = useUser();
  const { data: likeds } = useGet<{ product_ids: number[] }>(
    "user/favourite/?only_ids=true",
    undefined,
    { enabled: !!localStorage.getItem("token") }
  );
  const { data: categories } = useGet<Category[]>("category/");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  async function logOut() {
    const isConfirmed = await confirm({
      title: "Tizimdan chiqmoqchimisiz?",
    });
    if (isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      queryClient.setQueryData(["user/"], null);
      navigate({ to: "/" });
    }
  }

  return (
    <header className="flex flex-col sticky top-0 left-0 right-0 z-10 backdrop-blur bg-accent/60 px-2 sm:px-4 z-40">
      <div className="flex items-center justify-between py-1.5 sm:py-3">
        <Link to="/">
          <h2 className="hidden sm:inline text-xl md:text-2xl font-semibold">
            Boaz
          </h2>
        </Link>
        <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
          {pathname !== "/auth" && <ParamInput className="sm:w-max" />}
          <div className="flex">
            <TooltipProvider>
              <Tooltip>
                {!!username && (
                  <TooltipTrigger asChild>
                    <Link to="/likeds" className="relative hidden sm:inline">
                      <Button icon={<Heart width={18} />} variant="ghost" />
                      {!!likeds?.product_ids?.length &&
                        likeds?.product_ids?.length! >= 1 && (
                          <Badge className="absolute -top-2 -right-2 z-10">
                            {likeds?.product_ids?.length}
                          </Badge>
                        )}
                    </Link>
                  </TooltipTrigger>
                )}
                <TooltipContent>
                  <p>Tanlanganlar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/basket" className="relative hidden sm:inline">
                    <Button
                      icon={<ShoppingCart width={18} />}
                      variant="ghost"
                    />
                    {!!store?.length && store?.length! >= 1 && (
                      <Badge className="absolute -top-2 -right-2">
                        {store?.length}
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Savat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {is_admin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/products">
                      <Button icon={<Settings width={18} />} variant="ghost" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Admin</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {pathname === "/categories" &&  <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CategoryDrawer/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Admin</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>}
            {username ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      icon={<LogOut width={18} />}
                      variant="ghost"
                      onClick={logOut}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chiqish</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/auth">
                      <Button icon={<LogIn width={18} />} variant="ghost" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Kirish</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      {!["/auth", "/products", "/categories"].find((p) => pathname.includes(p)) && (
        <div className="hidden md:flex w-full overflow-x-auto gap-4 pb-2">
          {categories?.map((c) => (
            <Link
              to={`/categories/?category=${c.id}`}
              className="text-primary/80 hover:text-primary"
              key={c.id}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
