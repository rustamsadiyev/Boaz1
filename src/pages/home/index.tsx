import ProductCard from "@/components/shared/product-card";
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

export default function Home() {
  const search: any = useSearch({ from: "__root__" });
  const sevenDaysAgo = format(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd');

  const latest = useInfiniteGet<Product>(
    "product/?created_at_from="+sevenDaysAgo,
    search
  );

  const prices = useInfiniteGet<Product>(
    "product/?highest_discount=true",
    search
  );
  
  const top=useInfiniteGet<Product>(
    "product/?most_sold=true",
    search
  );

  const { username } = useUser();

  return (
    <Loading loading={latest.isLoading}>
      <div className="space-y-6 sm:space-y-9 md:space-y-12">
       {latest?.data?.length&& latest?.data?.length>0 &&<div className="space-y-2 md:space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium">
            Haftaning eng yangi maxsulotlari
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full maxw-sm relative rounded"
            plugins={[Autoplay({ delay: 3000, stopOnFocusIn: false, stopOnInteraction: false })]}
          >
            <CarouselContent className="flex items-center">
              {latest?.data?.map((d, i: number) => (
                <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 2xl:basis-1/6">
                  <ProductCard p={d} key={i} is_authenticated={!!username} />
                </CarouselItem>
              ))}
              <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 2xl:basis-1/6 h-full grid place-items-center">
                <div className="w-full flex justify-center py-4" ref={latest.ref}>
                  {latest.isFetchingNextPage && <Loader size="responsive" />}
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>}
      {prices?.data?.length&& prices?.data?.length>0 &&  <div className="space-y-2 md:space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium">
            Chegirmadan bahramand bo'ling
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full maxw-sm relative rounded"
            plugins={[Autoplay({ delay: 3000, stopOnFocusIn: false, stopOnInteraction: false })]}
          >
            <CarouselContent className="flex items-center">
              {prices?.data?.map((d, i: number) => (
                <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 2xl:basis-1/6">
                  <ProductCard p={d} key={i} is_authenticated={!!username} />
                </CarouselItem>
              ))}
              <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 2xl:basis-1/6 h-full grid place-items-center">
                <div className="w-full flex justify-center py-4" ref={prices.ref}>
                  {prices.isFetchingNextPage && <Loader size="responsive" />}
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>}
     {top?.data?.length&& top?.data?.length>0 &&   <div className="space-y-2 md:space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium">
            Top maxsulotlar
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full maxw-sm relative rounded"
            plugins={[Autoplay({ delay: 3000, stopOnFocusIn: false, stopOnInteraction: false })]}
          >
            <CarouselContent className="flex items-center">
              {top.data?.map((d, i: number) => (
                <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 2xl:basis-1/6">
                  <ProductCard p={d} key={i} is_authenticated={!!username} />
                </CarouselItem>
              ))}
              <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 2xl:basis-1/6 h-full grid place-items-center">
                <div className="w-full flex justify-center py-4" ref={top.ref}>
                  {top.isFetchingNextPage && <Loader size="responsive" />}
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>}
      </div>
    </Loading>
  );
}
