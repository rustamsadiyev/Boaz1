import {
    List,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import  {useTranslation} from "react-i18next";

export default function Header() {
    const { store } = useStore<{ name: string }[]>("baskets");
    const confirm = useConfirm();
    const { username, is_admin, is_best_client } = useUser();
    const [showDiv, setShowDiv] = useState(false);
    const { t, i18n } = useTranslation();

    const { data: likeds } = useGet<{ product_ids: number[] }>(
        "user/favourite/?only_ids=true",
        undefined,
        { enabled: !!localStorage.getItem("token") }
    );
    const { data: categories, isLoading } = useGet<Category[]>("category/");
    const { data } = useGet<
        {
            category: { name: string; id: number };
            vendors: { name: string; id: number }[];
        }[]
    >("category/?with_vendors=true");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const pathname = useLocation().pathname;

    const handleChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = event.target.value;
        i18n.changeLanguage(selectedLanguage);
    }

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

    if (pathname === "/auth") return null;
    return (
<div className="overflow-hidden bg-background/60 sticky top-0 left-0 right-0 z-40">
    <header className="flex flex-col backdrop-blur px-2 sm:px-4 xl:container mx-auto">
        <div className="flex items-center justify-between py-1.5 sm:py-3">
            <Link to="/">
                <h2 className=" sm:max-xmd:hidden hidden sm:inline text-2xl md:text-3xl xl:text-4xl font-semibold font-[Lobster] text-primary">
                    Boaz
                </h2>
            </Link>
            <div className="flex justify-between gap-1 w-full sm:w-auto overflow-x-auto">
                {pathname !== "/auth" && (
                    <ParamInput className="flex-shrink-0  " />
                )}
                    
                <div className="flex gap-1 flex-shrink-0 sm:max-md: ">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to="/categories"
                                    className="hidden sm:inline"
                                    activeProps={{
                                        className: "!text-primary",
                                    }}
                                >
                                    <Button
                                        icon={<List width={18} />}
                                        variant="ghost"
                                    />

                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Kategoriyalar</p>
                            </TooltipContent>
                        </Tooltip>  
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild className="hidden sm:inline">
                                <Link
                                    to="/warehouse"
                                    activeProps={{
                                        className: "!text-primary",
                                    }}
                                >
                                    {(is_best_client || is_admin) && (
                                        <Button
                                            icon={<Warehouse width={18} />}
                                            variant="ghost"
                                        />
                                    )}
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ulgurchi sotib oling</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <div className="relative">
    <Link
        to="/basket"
        className="relative hidden sm:inline"
        activeProps={{
            className: "!text-primary",
        }}
    >
        <Button
            icon={<ShoppingCart width={18} />}
            variant="ghost"
        />
        {!!store?.length && store?.length >= 1 && (
            <Badge className="absolute -top- -right-2 z-20 overflow-visible">
                {store?.length}
            </Badge>
        )}
    </Link>
                                </div>

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
                                    <Link
                                        to="/admin/products"
                                        activeProps={{
                                            className: "!text-primary",
                                        }}
                                    >
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
                                        <DropdownMenuTrigger
                                            className="!outline-none hidden sm:flex"
                                            asChild
                                        >
                                            <Button
                                                icon={<User width={18} />}
                                                variant="ghost"
                                                className={
                                                    pathname === "/profile"
                                                        ? "text-primary"
                                                        : ""
                                                }
                                            />
                                        </DropdownMenuTrigger>
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
                        pathname !== "/auth" && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link to="/auth">
                                            <Button
                                                icon={<LogIn width={18} />}
                                                variant="ghost"
                                            />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Kirish</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                        )
                    )}
                    
                    <select
            onChange={handleChangeLanguage}
            className="border border-gray-300 rounded-md py-1 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
            <option value="uz">Uzb</option>
            <option value="afg">دری</option>
        </select>
                </div>
            </div>
        </div>
    </header>
</div>

    );
}
