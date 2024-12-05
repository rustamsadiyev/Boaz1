import {
  LogIn,
  LogOut,
  Settings,
  ShoppingCart,
  User,
  Warehouse,
} from "lucide-react";
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
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Header() {
  const { store } = useStore<{ name: string }[]>("baskets");
  const confirm = useConfirm();
  const { username, is_admin } = useUser();
  const { data: likeds } = useGet<{ product_ids: number[] }>(
    "user/favourite/?only_ids=true",
    undefined,
    { enabled: !!localStorage.getItem("token") }
  );
  const { data: categories, isLoading } = useGet<Category[]>("category/");
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

  if(pathname === "/auth") return null
  return (
    <div className="bg-background/60 sticky top-0 left-0 right-0 z-40">
      <header className="flex flex-col  backdrop-blur px-2 sm:px-4 xl:container mx-auto 2xl:p-0">
        <div className="flex items-center justify-between py-1.5 sm:py-3">
          <Link to="/">
            <h2 className="hidden sm:inline text-2xl md:text-3xl xl:text-4xl font-semibold font-[Lobster] text-primary">
              Boaz
            </h2>
          </Link>
          <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
            {pathname !== "/auth" && <ParamInput className="sm:w-max" />}
            <div className="flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/basket" className="relative hidden sm:inline" activeProps={{
                      className: "!text-primary"
                    }}>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="hidden sm:inline">
                    <Link to="/warehouse" activeProps={{
                      className: "!text-primary"
                    }}>
                      <Button
                        icon={<Warehouse width={18} />}
                        variant="ghost"
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ulgurchi sotib oling</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {is_admin && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/admin/products" activeProps={{
                        className: "!text-primary"
                      }}>
                        <Button
                          icon={<Settings width={18} />}
                          variant="ghost"
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Admin</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {username ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <div className="relative h-10">
                          <DropdownMenuTrigger className="!outline-none" asChild>
                            <Button
                              icon={<User width={18} />}
                              variant="ghost"
                              className={pathname === "/profile" ? "text-primary" : ""}
                            />
                          </DropdownMenuTrigger>
                        </div>
                        <DropdownMenuContent align="center">
                          <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2"
                            asChild
                          >
                            <Link to="/profile">
                              <User width={16} /> {username}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2 !text-red-500"
                            onClick={logOut}
                          >
                            <LogOut width={16} /> Tizimdan chiqish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chiqish</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                pathname !== "/auth" &&
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
          <div className="flex w-full overflow-x-auto gap-8 pb-2">
            {isLoading
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                  <Skeleton key={c} className="w-32 h-6" />
                ))
              : categories?.map((c) => (
                  <Link
                    to={`/categories/?category=${c.id}`}
                    className={`text-secondary-foreground/50 hover:text-primary ${pathname === `/categories/?category=${c.id}` && "text-primary"}`}
                    key={c.id}
                  >
                    {c.name}
                  </Link>
                ))}
          </div>
      </header>
    </div>
  );
}
