import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useGet } from "@/hooks/useGet";
import Loading from "@/layouts/loading";
import { useParams } from "@tanstack/react-router";
import CustomImage from "@/components/custom/image";
import { useMemo, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { formatMoney } from "@/lib/format-money";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/custom/languageContext";

export default function Product() {
    const params = useParams({ from: "/_main/products/$product" });
    const { store, setStore } = useStore<Product[]>("baskets");

    const { data: d, isLoading } = useGet<Product>(`product/` + params.product + "/");
    const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

    const { name } = useLanguage();

    const isInBasket = useMemo(() => {
        return store?.some((b) => b.id === d?.id);
    }, [store]);

    const toggleBasket = (d: Product) => {
        const updatedBaskets = isInBasket
            ? store?.map((b) =>
                  b.id === d?.id ? { ...b, count: (b.count || 0) + 1 } : b
              )
            : [...(store || []), { ...d, count: 1 }];

        setStore(updatedBaskets || []);
        !isInBasket && toast.success(d?.name_uz + `${"savatchaga qo'shildi"}`);
    };

    const productName = name === 'name_uz' ? d?.name_uz : d?.name_fa;
    const productDescription = name === 'name_fa' ? d?.description_uz : d?.description_fa;

    return (
        <Loading loading={isLoading}>
            <div className="flex flex-col md:flex-row gap-8 w-full">
                <div className="bg-background md:max-w-[500px] rounded-lg">
                    <Carousel
                        className="w-full"
                        plugins={[plugin.current]}
                        opts={{
                            loop: true,
                        }}
                    >
                        <CarouselContent>
                            {[d?.image1, d?.image2, d?.image3, d?.image4]?.map((m) => (
                                <CarouselItem key={m} className="relative">
                                    <CustomImage
                                        src={m}
                                        alt="product image"
                                        height={300}
                                        contain
                                        width={"100%"}
                                        className="mix-blend-multiply"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2" />
                        <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2" />
                    </Carousel>
                </div>
                <div className="flex flex-col justify-between items-start gap-6 md:gap-8 w-full">
                    <div className="space-y-4">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-medium border-b pb-2">
                            {productName} {/* Displaying the correct name based on language */}
                        </h2>
                        <div className="flex items-center gap-4 w-full justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-base sm:text-lg md:text-xl font-medium">
                                    {formatMoney(d?.discounted_price || d?.price)}
                                </h2>
                                {d?.discounted_price && (
                                    <p className="text-sm sm:text-base md:text-lg line-through">
                                        {formatMoney(d?.price)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                            {productDescription} {/* Displaying the correct description based on language */}
                        </p>
                    </div>
                    <div className="relative w-max">
                        <Button
                            icon={<ShoppingCart width={18} />}
                            onClick={() => toggleBasket(d as Product)}
                        >
                            Savatchaga qo'shish
                        </Button>
                        {isInBasket && (
                            <Badge className="absolute -top-3 -right-3 border-2 border-secondary">
                                {store?.find((b) => b.id === d?.id)?.count}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </Loading>
    );
}