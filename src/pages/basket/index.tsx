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
      <h2 className="text-xl md:text-2xl font-medium border-b pb-2">
        Savatingiz {" "}
       {!!store?.length? <span className="text-muted-foreground">{store?.length} maxsulot</span>:"bo'sh"}
      </h2>

      <div className="flex flex-col gap-4">
        {store?.map((product) => (
            <BasketCard key={product.id} product={product} />
        ))}
      </div>

      {!!store?.length && (
        <div className=" bg-background border-t p-4">
          <div className="container flex items-center justify-between">
            <div className="text-lg font-medium">
              Total: ${formatMoney(totalPrice.toFixed(2))}
            </div>
            <Button onClick={handleSell} size="lg">
              Buyurtmani amalga oshirish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
