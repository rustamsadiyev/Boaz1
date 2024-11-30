import { Card } from "@/components/ui/card";
import { MinusIcon, PlusIcon, Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import CustomImage from "@/components/custom/image";
import { formatMoney } from "@/lib/format-money";
import SeeInView from "@/components/ui/see-in-view";

export default function BasketCard({ product }: { product: Product }) {
  const plugin = useRef(Autoplay({ delay: 1000 }));
  const fade = useRef(Fade());

  const { store, setStore } = useStore<Product[]>("baskets");

  const handleQuantity = (id: number, action: "increase" | "decrease") => {
    if (!store) return;
    const newStore = store.map((item) => {
      if (item.id === id) {
        const newCount = (item.count || 1) + (action === "increase" ? 1 : -1);
        if (newCount < 1) return item;
        return { ...item, count: newCount };
      }
      return item;
    });
    setStore(newStore);
  };

  const handleRemove = (id: number) => {
    if (!store) return;
    const newStore = store.filter((item) => item.id !== id);
    setStore(newStore);
  };

  return (
    <Card key={product.id} className="p-4">
      <div className="flex items-center gap-4 w-full justify-between">
        <Carousel
          className="w-max max-w-32"
          plugins={[plugin.current, fade.current]}
        >
          <CarouselContent>
            {[
              product.image1,
              product.image2,
              product.image3,
              product.image4,
            ]?.map((m) => (
              <CarouselItem key={m} className="relative">
                <SeeInView url={m}>
                  <CustomImage
                    src={m}
                    alt="product image"
                    height={120}
                    width={120}
                    onMouseEnter={() => plugin.current.play()}
                    onMouseLeave={() => plugin.current.stop()}
                    className="w-max rounded-md"
                  />
                </SeeInView>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-muted-foreground">
          {formatMoney(product.price, "", true)}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantity(product.id, "decrease")}
          >
            <MinusIcon width={18} />
          </Button>
          <span className="w-10 text-center">{product.count || 1}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantity(product.id, "increase")}
          >
            <PlusIcon width={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="!text-destructive"
            onClick={() => handleRemove(product.id)}
          >
            <Trash2 width={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
