import ProductCard from "@/components/shared/product-card";
import Loader from "@/components/ui/loader";
import { useUser } from "@/constants/useUser";
import { useInfiniteGet } from "@/hooks/useInfiniteGet";
import Loading from "@/layouts/loading";
import { useSearch } from "@tanstack/react-router";
import Filter from "./filter";

export default function Category() {
  const search: any = useSearch({ from: "__root__" });
  const { data, ref, isFetchingNextPage, isLoading } = useInfiniteGet<Product>(
    "product/",
    search
  );

  const { username } = useUser();
  return (
    <div className="flex items-start gap-4 w-full relative">
      <div className="hidden md:block">
        <Filter />
      </div>
      <Loading loading={isLoading}>
        <div className="flex flex-col w-full md:ml-64 md:pl-4">
          <div className="w-full grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,_minmax(14rem,_auto))] gap-2 sm:gap-4">
            {data?.map((d, i: number) => (
              <ProductCard p={d} key={i} is_authenticated={!!username} />
            ))}
          </div>
          <div className="w-full flex justify-center py-4" ref={ref}>
            {isFetchingNextPage && <Loader size="responsive" />}
          </div>
        </div>
      </Loading>
    </div>
  );
}