import { useLanguage } from "@/components/custom/languageContext";
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

import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function BasketCard({ product }: { product: Product }) {
  const plugin = useRef(Autoplay({ delay: 1000 }));
  const fade = useRef(Fade());
  const { store, setStore } = useStore<Product[]>("baskets");
  const { name } = useLanguage(); 

  const [inputValue, setInputValue] = useState(product.count || 1);

  const handleQuantity = (id: number, action: "increase" | "decrease") => {
    if (!store) return;
    const newStore = store.map((item) => {
      if (item.id === id) {
        const newCount = (item.count || 1) + (action === "increase" ? 1 : -1);
        if (newCount < 1) return item;
        setInputValue(newCount);
        return { ...item, count: newCount };
      }
      return item;
    });
    setStore(newStore);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1) {
      setInputValue(value);
    } else if (e.target.value === "") {
      setInputValue(0);
    }
  };

  const handleInputBlur = () => {
    if (!store) return;
    const newStore = store.map((item) => {
      if (item.id === product.id) {
        return { ...item, count: inputValue };
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

  const productName = name === 'name_uz' ? product.name_uz : product.name_fa;

  return (
    <Card key={product.id} className="p-4">
      <div className="flex items-center gap-4 w-full justify-between">
        <Carousel
          className="w-max max-w-32"
          plugins={[plugin.current, fade.current]}
        >
          <CarouselContent>
            {[product.image1, product.image2, product.image3, product.image4].map((m) => (
              <CarouselItem key={m} className="relative">
                <SeeInView url={m}>
                  <CustomImage
                    src={m}
                    alt="product image"
                    height={120}
                    width={120}
                    onMouseEnter={() => plugin.current.play()}
                    onMouseLeave={() => plugin.current.stop()}
                    className="rounded-md sm:w-max"
                  />
                </SeeInView>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex items-end sm:items-center justify-between w-full gap-x-4 gap-y-2 flex-col sm:flex-row flex-wrap xsm:max-sm:items-start">
          <h3 className="text-sm sm:text-base sm:max-w-[10vh] font-medium">{productName}</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            {formatMoney(product.price, "", true)}
          </p>
          <div className="flex xsm:max-sm:max-w-[21vh] items-center gap-2 sm:max-md:gap-1 xsm:max-sm:gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantity(product.id, "decrease")}
              className="h-7 w-7 w-10 h-10 sm:max-md:w-8 xsm:max-sm:w-14 "
            >
              <MinusIcon width={18} />
            </Button>
            <Input
              min="1"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-20 sm:max-md:w-16 text-center xsm:max-sm:w-12 "
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantity(product.id, "increase")}
              className="h-7 w-7 w-10 h-10 sm:max-md:w-8 xsm:max-sm:w-14 "
            >
              <PlusIcon width={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(product.id)}
              className="!text-destructive h-7 w-7 sm:w-10 sm:h-10 xsm:max-sm:w-14 "
            >
              <Trash2 width={18} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}