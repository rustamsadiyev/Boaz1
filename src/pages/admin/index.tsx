import Products from "./products";
import Categories from "./categories";
import ParamAnimatedTabs from "@/components/param/animated-tab";
import Vendors from "./vendors";
import Orders from "./orders";

export default function Admin() {
  return (
    <ParamAnimatedTabs
      options={[
        {
          name:"Buyurtmalar",
          id:"orders",
          content:<Orders/>
        },
        {
          name: "Maxsulotlar",
          id: "products",
          content: <Products />,
        },
        {
          name: "Kategoriyalar",
          id: "categories",
          content: <Categories />,
        },
        {
          name:"Firmalar",
          id:"companies",
          content:<Vendors/>
        }
      ]}
    />
  );
}
