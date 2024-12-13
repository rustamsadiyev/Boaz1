import { useInfiniteGet } from "@/hooks/useInfiniteGet";
import Loading from "@/layouts/loading";
import AdminOrderCard from "./admin-order-card";
import { useSearch } from "@tanstack/react-router";

export default function Orders() {
    const search: any = useSearch({ from: "__root__" });
    const { data, isLoading } = useInfiniteGet<{
        id: number;
        quantity: number;
        status: number;
        updated_at: string;
        cart: { id: number; order: 1; product: Product; quantity: number }[];
    }>("order/?pending=true", search);

    return (
        <div className="pt-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium border-b pb-2 mb-4">
                Buyurtmalar
            </h2>
            <Loading loading={isLoading}>
                <div className=" space-y-4 sm:max-md:grid sm:max-md:grid-cols-1 sm:max-md:gap-4 sm:max-md:p-2">
                    {data?.map((d, i: number) => (
                        <div className=" sm:max-md:gap-2 sm:max-md:p-4 bg-white shadow-md rounded-lg max-w-full overflow-hidden">
                            <AdminOrderCard key={d.id || i} p={d} />
                        </div>
                    ))}
                </div>
            </Loading>
        </div>
    );
}
