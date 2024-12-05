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
import { formatMoney } from "@/lib/format-money";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { useRef } from "react";

export default function OrderCard({
  p,
}: {
  p: {
    id: number;
    quantity: number;
    status: number;
    updated_at: string;
    cart: { id: number; order: 1; product: Product; quantity: number }[];
  };
}) {
  const plugin = useRef(Autoplay({ delay: 3000 }));
  const fade = useRef(Fade());

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-background p-4 rounded"
    >
      <div className="flex items-center justify-between">
        <p>
          Buyurtma holati:{" "}
          <span className="text-foreground font-semibold">
            {statuses[p.status as 0 | 1 | 2 | 3 | 4]}
          </span>
        </p>
        <p>
          Yetkazilish (Yetkazilgan) sanasi:{" "}
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
                Buyurtma id raqami{" "}
                <span className="text-foreground font-semibold">{c.id}</span>
              </p>
              <p className="font-normal text-muted-foreground">
                Soni:{" "}
                <span className="text-foreground font-semibold">
                  {c.quantity}
                </span>
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-4">
              <Carousel
                className="w-32"
                plugins={[plugin.current, fade.current]}
              >
                <CarouselContent>
                  {[
                    c.product.image1,
                    c.product.image2,
                    c.product.image3,
                    c.product.image4,
                  ]?.map((i) => (
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
                  <p className="font-semibold text-muted-foreground">Nomi: </p>
                  <p>{c.product?.name}</p>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <p className="font-semibold text-muted-foreground">Narxi: </p>
                  <p>
                    {formatMoney(
                      c.product?.discounted_price || c.product?.price,
                      undefined,
                      true
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p>{c.product?.description}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const statuses = {
  0: "To'lov qilinmagan",
  1: "Faol",
  2: "Yetkazilmoqda",
  3: "Bekor qilingan",
  4: "Yetkazilgan",
};