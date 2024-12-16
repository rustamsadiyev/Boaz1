import CustomImage from "@/components/custom/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useGet } from "@/hooks/useGet";
import { useRequest } from "@/hooks/useRequest";
import { useStore } from "@/hooks/useStore";
import { formatMoney } from "@/lib/format-money";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Heart, ShoppingCart } from "lucide-react";
import { useMemo, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/custom/languageContext";

export default function ProductCard({
    p,
    isLikeds,
    is_authenticated,
}: {
    p: Product;
    isLikeds?: boolean;
    is_authenticated: boolean;
}) {
    const baskets = useStore<Product[]>("baskets");
    const queryClient = useQueryClient();
    const { data: likeds } = useGet<{ product_ids: number[] }>(
        "user/favourite/?only_ids=true",
        undefined,
        { enabled: !!localStorage.getItem("token") }
    );
    const { t } = useTranslation();
    const { name: selectedLanguage } = useLanguage(); // Get the selected language from context

    const { post, isPending, remove } = useRequest();
    const plugin = useRef(Autoplay({ delay: 1000, playOnInit: false }));
    const fade = useRef(Fade());

    const isLiked =
        isLikeds ||
        useMemo(() => {
            return likeds?.product_ids?.some((l) => l === p.id);
        }, [likeds]);
    const isInBasket = useMemo(() => {
        return baskets.store?.some((b) => b.id === p.id);
    }, [baskets]);

    const toggleLiked = () => {
        if (isLiked) {
            toast.promise(remove("user/favourite/", { product_id: p.id }), {
                loading: `${t("Sevimlilardan olib tashlanmoqda...")}`,
                success: () => {
                    queryClient.setQueryData(
                        ["user/favourite/"],
                        (oldData: Product[]) =>
                            oldData.filter((l) => l.id !== p.id)
                    );
                    queryClient.setQueryData(
                        ["user/favourite/?only_ids=true"],
                        (oldData: { product_ids: number[] }) => ({
                            product_ids: oldData.product_ids.filter(
                                (l) => l !== p.id
                            ),
                        })
                    );
                    return p.name + `${t("sevimlilardan olib tashlandi")}`;
                },
            });
        } else {
            toast.promise(post("user/favourite/", { product_id: p.id }), {
                loading: `${t("Sevimlilarga qo'shilmoqda...")}`,
                success: () => {
                    queryClient.setQueryData(
                        ["user/favourite/"],
                        (oldData: Product[]) => [...(oldData || []), p]
                    );
                    queryClient.setQueryData(
                        ["user/favourite/?only_ids=true"],
                        (oldData: { product_ids: number[] }) => ({
                            product_ids: [
                                ...(oldData?.product_ids || []),
                                p.id,
                            ],
                        })
                    );
                    return p.name + `${t("sevimlilarga qo'shildi")}`;
                },
            });
        }
    };

    const toggleBasket = () => {
        const updatedBaskets = isInBasket
            ? baskets.store?.map((b) =>
                  b.id === p.id ? { ...b, count: (b.count || 0) + 1 } : b
              )
            : [...(baskets.store || []), { ...p, count: 1 }];

        baskets.setStore(updatedBaskets || []);
        !isInBasket && toast.success(p.name + `${t("savatchaga qo'shildi")}`);
    };

    const productName = selectedLanguage === "name_uz" ? p.name_uz : p.name_fa;
    const productDescription =
        selectedLanguage === "name_uz" ? p.description_uz : p.description_fa;

    return (
        <Card className="overflow-hidden relative group" key={p.id}>
            <CardContent className="p-0">
                {is_authenticated && (
                    <Button
                        icon={
                            <Heart
                                className={cn(
                                    "text-destructive w-4 sm:w-[18px]",
                                    isLiked && "fill-destructive"
                                )}
                            />
                        }
                        variant="ghost"
                        className="w-7 h-7 sm:w-10 sm:h-10 absolute top-0 right-0 z-20 bg-secondary/60 rounded-full"
                        disabled={isPending}
                        onClick={toggleLiked}
                    />
                )}
                <Link to={`/products/${p.id}`}>
                    <Carousel
                        className="w-full max-w-full"
                        plugins={[plugin.current, fade.current]}
                    >
                        <CarouselContent>
                            {[p.image1, p.image2, p.image3, p.image4]?.map(
                                (m, i) => (
                                    <CarouselItem key={i} className="relative">
                                        <CustomImage
                                            key={i}
                                            src={m}
                                            alt="product image"
                                            contain
                                            height={200}
                                            width={"100%"}
                                            className="mix-blend-multiply group-hover:scale-[1.02] !h-40 sm:h-[200px] duration-300"
                                            onMouseEnter={() =>
                                                plugin.current.play()
                                            }
                                            onMouseLeave={() =>
                                                plugin.current.stop()
                                            }
                                        />
                                    </CarouselItem>
                                )
                            )}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
                    </Carousel>
                </Link>
                <div className="p-2 sm:p-3">
                    <Link to={`/products/${p.id}`}>
                        <h2 className="text-sm sm:text-base line-clamp-1">
                            {productName}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                            {productDescription}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground pt-2">
                            {t("Omborda")}:{" "}
                            <span className="text-foreground font-medium">
                                {p.stock} {t("ta")}
                            </span>
                        </p>
                    </Link>
                    <div className="flex items-center justify-between pt-2 mt-auto">
                        {p.discounted_price ? (
                            <div>
                                <p className="text-xs line-through text-muted-foreground">
                                    {formatMoney(p.price, "", true)}
                                </p>
                                <p className="text-xs sm:text-sm font-medium">
                                    {formatMoney(p.discounted_price, "", true)}
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs sm:text-sm font-medium">
                                {formatMoney(p.discounted_price, "", true)}
                            </p>
                        )}
                        <div className="w-max h-max relative -mr-1">
                            <Button
                                icon={
                                    <ShoppingCart className="w-4 sm:w-[18px]" />
                                }
                                variant="ghost"
                                className="w-7 h-7 sm:w-10 sm:h-10"
                                onClick={toggleBasket}
                            />
                            {isInBasket && (
                                <Badge className="absolute -top-2 right-1 sm:-right-2 px-1 sm:px-2 py-0 sm:py-0.5 text-[10px] sm:p-auto sm:text-xs">
                                    {
                                        baskets.store?.filter(
                                            (b) => b.id === p.id
                                        )[0].count
                                    }
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}