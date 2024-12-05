import ParamAnimatedTabs from "@/components/param/animated-tab";
import Loader from "@/components/ui/loader";
import { useInfiniteGet } from "@/hooks/useInfiniteGet";
import Loading from "@/layouts/loading";
import OrderCard from "./order-card";
import { useSearch } from "@tanstack/react-router";
import { Fade } from "react-awesome-reveal";
import ParamDateRange from "@/components/param/date-range-picker";

export default function OrdersHistory() {
  const search: any = useSearch({ from: "__root__" });
  const { data, ref, isLoading, isFetchingNextPage } = useInfiniteGet<{
    id: number;
    quantity: number;
    status: number;
    updated_at: string;
    cart: { id: number; order: 1; product: Product; quantity: number }[];
  }>("order/",search);
  console.log(data);
  return (
    <div className="overflow-hidden space-y-4">
        <ParamAnimatedTabs
          paramName="status"
          wrapperClassName='h-10'
          options={[
            {
              name: "Barcha buyurtmalar",
              id: "0",
            },
            {
              name: "To'lov qilinmagan",
              id: "10",
            },
            {
              name: "Faol",
              id: "1",
            },
          ]}
        />
      <Loading loading={isLoading}>
        <div className="flex flex-col gap-4">
          {data
            ?.filter((d) =>
              search.status
                ? d.status == (search.status == 10 ? 0 : search.status)
                : true
            )
            ?.map((d, i: number) => (
              <Fade direction="up" triggerOnce>
                <OrderCard p={d} key={i} />
              </Fade>
            ))}
        </div>

        <div className="w-full flex justify-center py-4" ref={ref}>
          {isFetchingNextPage && <Loader size="responsive" />}
        </div>
      </Loading>
    </div>
  );
}
