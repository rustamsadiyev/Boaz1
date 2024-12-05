import ParamAnimatedTabs from "@/components/param/animated-tab";
import Likeds from "./likeds";
import OrdersHistory from "./order";

export default function Profile() {
  return (
    <ParamAnimatedTabs
      options={[
        {
          name: "Buyurtmalar tarixi",
          id: "orders_history",
          content:<OrdersHistory/>
        },
        {
          name: "Tanlanganlar",
          id: "favourites",
          content:<Likeds/>
        },
      ]}
    />
  );
}
