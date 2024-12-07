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
                <div className="flex flex-col gap-4">
                    {data?.map((d, i: number) => (
                        <AdminOrderCard key={i} p={d} />
                    ))}
                </div>
            </Loading>
        </div>
    );
}
