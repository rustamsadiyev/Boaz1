import CustomImage from "@/components/custom/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useConfirm } from "@/hooks/useConfirm";
import { useRequest } from "@/hooks/useRequest";
import { formatMoney } from "@/lib/format-money";
import { useQueryClient } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Edit2, Trash2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/components/custom/languageContext"; // Import the useLanguage hook

export default function AdminProductCard({
    p,
    onEdit,
}: {
    p: Product;
    onEdit: () => void;
}) {
    const plugin = useRef(Autoplay({ delay: 1000, playOnInit: false }));

    const fade = useRef(Fade());

    const confirm = useConfirm();
    const { remove, isPending } = useRequest();
    const queryClient = useQueryClient();

    const { name } = useLanguage(); // Get the current selected language from context

    async function deleteProduct() {
        const isConfirmed = await confirm({
            title: p?.name + " ni o'chirmoqchimisiz?",
        });
        if (isConfirmed) {
            toast.promise(remove("product/" + p.id + "/"), {
                loading: "O'chirilmoqda...",
                success: () => {
                    queryClient.setQueryData(
                        ["product/"],
                        (oldData: {
                            pageParams: string[];
                            pages: {
                                next: string;
                                previous: string;
                                results: Product[];
                            }[];
                        }) => {
                            if (!oldData) return oldData;

                            return {
                                ...oldData,
                                pages: oldData.pages
                                    .map((page) => ({
                                        ...page,
                                        results: page.results.filter(
                                            (product) => product.id !== p.id
                                        ),
                                    }))
                                    .filter((page) => page.results.length > 0),
                            };
                        }
                    );

                    return p.name + " muvaffaqiyatli o'chirildi";
                },
            });
        }
    }

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
                                    contain
                                    width={"100%"}
                                    className="!h-40 sm:h-[200px]"
                                    onMouseEnter={() => plugin.current.play()}
                                    onMouseLeave={() => plugin.current.stop()}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="p-3">
                    <h2 className="text-sm sm:text-base font-medium">
                        {/* Dynamically display product name based on language */}
                        {name === "name_uz" ? p.name_uz : name === "name_fa" ? p.name_fa : p.name_uz}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {/* Dynamically display product description based on language */}
                        {name === "name_uz" ? p.description_uz : name === "name_fa" ? p.description_fa : p.description_uz}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground pt-2">
                        Omborda:{" "}
                        <span className="text-foreground font-medium">
                            {p.stock} ta
                        </span>
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
                            <Button
                                icon={<Trash2 className="w-4 sm:w-[18px]" />}
                                variant="ghost"
                                className="!text-destructive w-7 h-7 sm:w-10 sm:h-10"
                                disabled={isPending}
                                onClick={deleteProduct}
                            />
                            <Button
                                icon={<Edit2 className="w-4 sm:w-[18px]" />}
                                variant="ghost"
                                className="w-7 h-7 sm:w-10 sm:h-10"
                                onClick={onEdit}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}