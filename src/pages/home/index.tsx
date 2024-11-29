import ProductCard from "@/components/shared/product-card";
import Loader from "@/components/ui/loader";
import useFilter from "@/hooks/useFilter";
import { useInfiniteGet } from "@/hooks/useInfiniteGet";
import { useSearch } from "@tanstack/react-router";

export default function Home() {
  const search: any = useSearch({ from: "__root__" });
  const { data, ref, isFetchingNextPage } = useInfiniteGet<Product>(
    "product/",
    search
  );

  const filtered = useFilter<Product>(data);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,_minmax(14rem,_auto))] gap-2 sm:gap-4">
        {filtered?.map((d, i: number) => <ProductCard p={d} key={i} />)}
      </div>
      <div className="w-full flex justify-center py-4" ref={ref}>
        {isFetchingNextPage && <Loader />}
      </div>
    </div>
  );
}
