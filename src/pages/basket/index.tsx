import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format-money";
import BasketCard from "./basket-card";
import { toast } from "sonner";
import { useRequest } from "@/hooks/useRequest";
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";

export default function Basket() {
  const { store, setStore } = useStore<Product[]>("baskets");
  const {post,isPending}=useRequest();

  const { t } = useTranslation();

  const totalPrice =
    store?.reduce((acc, item) => acc + item.price * (item.count || 1), 0) || 0;
    
  const handleSell = async() => {
    await post("order/",store?.map((p) => ({ product: p.id, quantity: p.count })) || []
    )
    setStore([]);
    toast.success("Buyurtma amalga oshirildi");
  };

  return (
    <div className="space-y-6 overflow-hidden ">
      <h2 className="text-lg sm:text-xl md:text-2xl font-medium border-b pb-2">
        {t("savatingiz")} {" "}
       {!!store?.length? <span className="text-muted-foreground">{store?.length} {t("maxsulot")}</span>:`${t("bo'sh")}`}
      </h2>

      <div className="flex flex-col gap-4">
        {store?.map((product) => (
          <Fade key={product.id} direction="up">
            <BasketCard key={product.id} product={product} />
          </Fade>
        ))}
      </div>

      {!!store?.length && (
        <div className=" border-t pt-2 sm:pt-4 flex sm:items-center justify-between gap-x-4 gap-y-2 flex-col sm:flex-row">
            <div className="text-lg font-medium">
              Total: ${formatMoney(totalPrice.toFixed(2))}
            </div>
            <Button onClick={handleSell} size="lg" loading={isPending}>
              {t("Buyurtmani amalga oshirsh")}
            </Button>
        </div>
      )}
    </div>
  );
}