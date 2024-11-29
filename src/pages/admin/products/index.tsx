import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import ControlProduct from "./control-product";
import { useInfiniteGet } from "@/hooks/useInfiniteGet";
import AdminProductCard from "./admin-product-card";
import Loader from "@/components/ui/loader";
import useFilter from "@/hooks/useFilter";

export default function Products() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Product>();

  const { data, ref, isFetchingNextPage } = useInfiniteGet<Product>("product/");
  const filtered = useFilter<Product>(data);

  return (
    <div className="flex flex-col gap-4 items-end">
      <Button
        icon={<Plus width={18} />}
        onClick={() => {
          setOpen(true);
          setCurrent({} as Product);
        }}
      >
        Maxsulot
      </Button>
      <div className="w-full grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,_minmax(14rem,_auto))] gap-2 sm:gap-4">
        {filtered?.map((d, i: number) => (
          <AdminProductCard
            p={d}
            key={i}
            onEdit={() => {
              setCurrent(d);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <div className="w-full flex justify-center py-4" ref={ref}>
        {isFetchingNextPage && <Loader />}
      </div>

      <ControlProduct open={open} setOpen={setOpen} current={current} />
    </div>
  );
}
