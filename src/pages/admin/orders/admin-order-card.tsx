import React, { useContext, useRef } from "react";
import { useLanguage } from "@/components/custom/languageContext"; // Import the language context

import Image from "@/components/custom/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/useConfirm";
import { useRequest } from "@/hooks/useRequest";
import { formatMoney } from "@/lib/format-money";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function AdminOrderCard({
    p,
}: {
    p: {
        user: any;
        id: number;
        quantity: number;
        status: number;
        updated_at: string;
        cart: { id: number; order: 1; product: Product; quantity: number }[];
    };
}) {
    const plugin = useRef(Autoplay({ delay: 3000 }));
    const fade = useRef(Fade());
    const { t } = useTranslation();
    const { patch } = useRequest();
    const search: any = useSearch({ from: "__root__" });
    const queryClient = useQueryClient();
    const confirm = useConfirm();

    const { name } = useLanguage(); // Get the current language from the context

    async function changeStatus(status: number) {
        const isConfirmed =
            status === 3 || status === 4
                ? await confirm({
                      title:
                          status === 3
                              ? `${t("Buyurtmani bekor qilinsinmi")}`
                              : `${t("Buyurtmani tasdiqlansinmi")}`,
                  })
                : true;

        if (isConfirmed) {
            toast.promise(
                patch(`order/${p.id}/`, { ...search, status: undefined }),
                {
                    loading: `${t("O'zgartirilmoqda...")}`,
                    success: () => {
                        queryClient.invalidateQueries({
                            queryKey: ["order/?pending=true", search],
                        });
                        return `${t("Muvaffaqiyatli o'zgartirildi")}`;
                    },
                }
            );
        }
    }

    const statuses = {
        0: `${t("To'lov qilinmagan")}`,
        3: `${t("Bekor qilingan")}`,
        4: `${t("Yetkazilgan")}`,
    };

    return (
        <Accordion type="single" collapsible className="w-full bg-background p-4 rounded">
            <div className="flex sm:max-md:block items-center justify-between pb-4">
                <p>
                    {t("Holat")}:{" "}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <span className="text-foreground font-semibold flex items-center gap-1">
                                {statuses[p.status as 0 | 3 | 4]}{" "}
                                <ChevronDown width={18} />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => changeStatus(3)}>
                                {statuses[3]}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeStatus(4)}>
                                {statuses[4]}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </p>
                <p>
                    {t("Yetkazilish sanasi")}:{" "}
                    <span className="text-foreground font-semibold">
                        {p.updated_at.split("T")[0]}
                    </span>
                </p>
            </div>

            {p.cart?.map((c) => (
                <AccordionItem value={c.id.toString()} key={c.id}>
                    <AccordionTrigger>
                        <div className="flex flex-col items-start gap-2">
                            <p className="font-normal text-muted-foreground">
                                {t("Buyurtma id raqami")}
                                <span className="text-foreground font-semibold">{c.id}</span>
                            </p>
                            <div className="flex flex-col text-start">
                                <p className="font-normal text-muted-foreground items-start">
                                    {t("Buyurtma qiymati")}:{" "}
                                    <span className="text-foreground font-semibold">
                                        {formatMoney(
                                            (c.product?.discounted_price || c.product?.price) *
                                                c.quantity,
                                            undefined,
                                            true
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent>
                        <div className="flex items-center gap-4">
                            <Carousel className="w-32" plugins={[plugin.current, fade.current]}>
                                <CarouselContent>
                                    {[c.product.image1, c.product.image2, c.product.image3, c.product.image4]?.map((i) => (
                                        <CarouselItem key={i}>
                                            <Image
                                                src={i}
                                                alt={c.product.name}
                                                width={100}
                                                className="w-full h-full object-cover"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>

                            <div className="flex flex-col gap-2 items-start">
                                <div className="flex items-center gap-2 text-base">
                                    <p className="font-semibold text-muted-foreground">{t("Nomi")}: </p>
                                    <p>{name === "name_uz" ? c.product?.name_uz : c.product?.name_fa}</p>
                                </div>

                                <div className="flex items-center gap-2 text-base">
                                    <p className="font-semibold text-muted-foreground">{t("Narxi")}: </p>
                                    <p>
                                        {formatMoney(c.product?.discounted_price || c.product?.price, undefined, true)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-base">
                                    <p className="font-semibold text-muted-foreground">{t("Mijoz ismi")}: </p>
                                    <p>{p.user?.full_name || t("No name available")}</p>
                                </div>

                                <p className="font-semibold text-muted-foreground">
                                    {t("Soni")}:{" "}
                                    <span className="text-foreground font-semibold">{c.quantity}</span>
                                </p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}