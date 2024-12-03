import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format-money";
import BasketCard from "./basket-card";

export default function Basket() {
  const { store, setStore } = useStore<Product[]>("baskets");

  const totalPrice =
    store?.reduce((acc, item) => acc + item.price * (item.count || 1), 0) || 0;

  const handleSell = () => {
    setStore([]);
    alert("Products sold successfully!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-medium border-b pb-2">
        Savatingiz {" "}
       {!!store?.length? <span className="text-muted-foreground">{store?.length} maxsulot</span>:"bo'sh"}
      </h2>

      <div className="flex flex-col gap-4">
        {store?.map((product) => (
            <BasketCard key={product.id} product={product} />
        ))}
      </div>

      {!!store?.length && (
        <div className=" border-t pt-2 sm:pt-4 flex sm:items-center justify-between gap-x-4 gap-y-2 flex-col sm:flex-row">
            <div className="text-lg font-medium">
              Total: ${formatMoney(totalPrice.toFixed(2))}
            </div>
            <Button onClick={handleSell} size="lg">
              Buyurtmani amalga oshirish
            </Button>
        </div>
      )}
    </div>
  );
}
