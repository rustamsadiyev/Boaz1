import CustomImage from "@/components/custom/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useUser } from "@/constants/useUser";
import { useGet } from "@/hooks/useGet";
import { useRequest } from "@/hooks/useRequest";
import { useStore } from "@/hooks/useStore";
import { formatMoney } from "@/lib/format-money";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Heart, ShoppingCart } from "lucide-react";
import { useMemo, useRef } from "react";
import { toast } from "sonner";

export default function ProductCard({ p, isLikeds }: { p: Product, isLikeds?: boolean }) {
  const baskets = useStore<Product[]>("baskets");
  const { username } = useUser();
  const queryClient = useQueryClient();
  const { data: likeds } = useGet<Product[]>("user/favourite/",undefined,{enabled:!!localStorage.getItem("token")});

  const { post, isPending, remove } = useRequest();

  const plugin = useRef(Autoplay({ delay: 1000, playOnInit: false }));
  const fade = useRef(Fade());

  const isLiked =isLikeds|| useMemo(() => {
    return likeds?.some((l) => l.id === p.id);
  }, [likeds]);
  const isInBasket = useMemo(() => {
    return baskets.store?.some((b) => b.id === p.id);
  }, [baskets]);

  const toggleLiked = () => {
    if (isLiked) {
      toast.promise(remove("user/favourite/", { product_id: p.id }), {
        loading: "Sevimlilardan olib tashlanmoqda...",
        success: () => {
          queryClient.setQueryData(["user/favourite/"], (oldData: Product[]) =>
            oldData.filter((l) => l.id !== p.id)
          );
          return p.name + " sevimlilardan olib tashlandi";
        },
      });
    } else {
      toast.promise(post("user/favourite/", { product_id: p.id }), {
        loading: "Sevimlilarga qo'shilmoqda...",
        success: () => {
          queryClient.setQueryData(
            ["user/favourite/"],
            (oldData: Product[]) => [...(oldData || []), p]
          );
          return p.name + " sevimlilarga qo'shildi";
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
    !isInBasket && toast.success(p.name + " savatchaga qo'shildi");
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Carousel
          className="w-full max-w-full"
          plugins={[plugin.current, fade.current]}
        >
          <CarouselContent>
            {[p.image1, p.image2, p.image3, p.image4]?.map((m) => (
              <CarouselItem key={m} className="relative">
                <CustomImage
                  src={m}
                  alt="product image"
                  height={200}
                  width={"100%"}
                  onMouseEnter={() => plugin.current.play()}
                  onMouseLeave={() => plugin.current.stop()}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="p-3">
          <h2 className="text-xs sm:text-base font-medium">{p.name}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {p.description}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground pt-2">
            Omborda:{" "}
            <span className="text-foreground font-medium">{p.stock} ta</span>
          </p>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs line-through text-muted-foreground">
                {formatMoney(p.price, "", true)}
              </p>
              <p className="text-xs sm:text-sm font-medium">
                {formatMoney(p.discounted_price, "", true)}
              </p>
            </div>
            <div className="flex">
              {!!username && (
                <Button
                  icon={
                    <Heart
                      className={cn(
                        "text-destructive w-4 sm:w-[18px]",
                        isLiked && "fill-destructive",
                      )}
                    />
                  }
                  variant="ghost"
                  className="w-7 h-7 sm:w-10 sm:h-10"
                  disabled={isPending}
                  onClick={toggleLiked}
                />
              )}
              <div className="w-max h-max relative">
                <Button
                  icon={<ShoppingCart className="w-4 sm:w-[18px]" />}
                  variant="ghost"
                  className="w-7 h-7 sm:w-10 sm:h-10"
                  onClick={toggleBasket}
                />
                {isInBasket && (
                  <Badge className="absolute -top-2 -right-1 sm:-right-2 px-1 sm:px-2 py-0 sm:py-0.5 text-[10px] sm:p-auto sm:text-xs">
                    {baskets.store?.filter((b) => b.id === p.id)[0].count}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
