import ProductCard from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Loader from "@/components/ui/loader";
import { useUser } from "@/constants/useUser";
import { useInfiniteGet } from "@/hooks/useInfiniteGet";
import Loading from "@/layouts/loading";
import { useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
import { Fade, Slide } from "react-awesome-reveal";

export default function Home() {
  const search: any = useSearch({ from: "__root__" });
  const sevenDaysAgo = format(
    new Date(new Date().setDate(new Date().getDate() - 7)),
    "yyyy-MM-dd"
  );

  const latest = useInfiniteGet<Product>(
    "product/?created_at_from=" + sevenDaysAgo,
    search
  );

  const prices = useInfiniteGet<Product>(
    "product/?highest_discount=true",
    search
  );

  const top = useInfiniteGet<Product>("product/?most_sold=true", search);

  const { username } = useUser();

  return (
    <Loading loading={latest.isLoading}>
      <div className="space-y-6 sm:space-y-9 md:space-y-12">
        {latest?.data?.length > 0 && (
          <div className="space-y-2 md:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium">
              Haftaning eng yangi maxsulotlari
            </h2>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full maxw-sm relative rounded"
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnFocusIn: false,
                  stopOnInteraction: false,
                }),
              ]}
            >
              <CarouselContent className="flex items-center">
                {latest?.data?.map((d, i: number) => (
                  <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 2xl:basis-1/6">
                    <Fade triggerOnce key={i}>
                      <ProductCard
                        p={d}
                        key={i}
                        is_authenticated={!!username}
                      />
                    </Fade>
                  </CarouselItem>
                ))}
                <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 2xl:basis-1/6 h-full grid place-items-center">
                  <div
                    className="w-full flex justify-center py-4"
                    ref={latest.ref}
                  >
                    {latest.isFetchingNextPage && <Loader size="responsive" />}
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        )}
        {prices?.data?.length > 0 && (
          <div className="space-y-2 md:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium">
              Chegirmadan bahramand bo'ling
            </h2>
            <div className="w-full grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,_minmax(14rem,_auto))] gap-2 sm:gap-4">
              {prices?.data?.map((d, i: number) => (
                <Fade direction="up" triggerOnce>
                  <ProductCard p={d} key={i} is_authenticated={!!username} />
                </Fade>
              ))}
            </div>
            {prices.isFetchingNextPage && (
              <div className="w-full flex justify-center py-4">
                <Loader size="responsive" />
              </div>
            )}
            {prices.hasNextPage && (
              <div className="flex items-center justify-center pt-8">
                <Button
                  onClick={prices.fetchNextPage}
                  size="lg"
                  variant="ghost"
                  className="!bg-background"
                >
                  Yana ko'rsatish +10
                </Button>
              </div>
            )}
          </div>
        )}
        {top?.data?.length > 0 && (
          <div className="space-y-2 md:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium">
              Top maxsulotlar
            </h2>
            <div className="w-full grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,_minmax(14rem,_auto))] gap-2 sm:gap-4">
              {top?.data?.map((d, i: number) => (
                <Slide direction="up" triggerOnce>
                  <ProductCard p={d} key={i} is_authenticated={!!username} />
                </Slide>
              ))}
            </div>
            {top.isFetchingNextPage && (
              <div className="w-full flex justify-center py-4">
                <Loader size="responsive" />
              </div>
            )}
            {top.hasNextPage && (
              <div className="flex items-center justify-center pt-8">
                <Button
                  onClick={top.fetchNextPage}
                  size="lg"
                  variant="ghost"
                  className="!bg-background"
                >
                  Yana ko'rsatish +10
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Loading>
  );
}
