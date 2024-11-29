import { LogIn, LogOut, Settings, ShoppingCart } from "lucide-react";
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

export default function Header() {
  const { store } = useStore<{ name: string }[]>("baskets");
  const { data: categories } = useGet<Category[]>("category/");
  const { username, is_admin } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    queryClient.setQueryData(["user/"], null);
    navigate({ to: "/" });
  }

  return (
    <header className="flex flex-col gap pb-2">
      <div className="flex items-center justify-between py-2">
        <Link to="/">
          <h2 className="hidden sm:inline text-xl md:text-2xl font-semibold">
            Boaz
          </h2>
        </Link>
        <div className="flex items-center justify-between gap-4 w-full sm:w-auto">
          {pathname !== "/auth" && <ParamInput className="sm:w-max" />}
          <div className="flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Button
                      icon={<ShoppingCart width={18} />}
                      variant="ghost"
                    />
                    {store?.length && store?.length! >= 1 && (
                      <Badge className="absolute -top-2 -right-2">
                        {store?.length}
                      </Badge>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Savatcha</p>
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
      {!["/auth", "/products"].includes(pathname) && (
        <div className="flex w-full overflow-x-auto gap-4">
          {categories?.map((c) => (
            <Link
              to="/"
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
