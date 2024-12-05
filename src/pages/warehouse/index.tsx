import { useInfiniteGet } from "@/hooks/useInfiniteGet";
import Loader from "@/components/ui/loader";
import ProductCard from "@/components/shared/product-card";
import { useUser } from "@/constants/useUser";
import { Slide } from "react-awesome-reveal";

export default function Warehouse() {
  const { data, ref, isFetchingNextPage } = useInfiniteGet<Product>("product/?highest_discount=true");
  const { username } = useUser();
  return (
    <div className="space-y-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-medium border-b pb-2">
        Ulgurchi sotib oling va katta chegirmalarga ega bo'ling!
      </h2>

      <div className="w-full grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,_minmax(14rem,_auto))] gap-2 sm:gap-4">
        {data?.map((product) => (
          <Slide direction="up" triggerOnce>
          <ProductCard key={product.id} p={product} is_authenticated={!!username} />
          </Slide>
        ))}
        <div className="w-full flex justify-center py-4" ref={ref}>
          {isFetchingNextPage && <Loader size="responsive" />}
        </div>
      </div>
    </div>
  );
}
