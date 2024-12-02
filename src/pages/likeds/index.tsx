import ProductCard from "@/components/shared/product-card";
import useFilter from "@/hooks/useFilter";
import { useGet } from "@/hooks/useGet";
import Loading from "@/layouts/loading";

export default function Likeds() {
  const { data, isLoading } = useGet<Product[]>("user/favourite/",undefined,{enabled:!!localStorage.getItem("token")});
  const filtered = useFilter<Product>(data);
  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-medium border-b pb-2">Tanlanglar</h2>
      <Loading loading={isLoading}>
        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,_minmax(14rem,_auto))] gap-2 sm:gap-4">
          {filtered?.map((d, i: number) => (
            <ProductCard p={d} key={i} isLikeds is_authenticated />
          ))}
        </div>
      </Loading>
    </div>
  );
}
