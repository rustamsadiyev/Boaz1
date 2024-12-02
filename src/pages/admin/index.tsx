import Products from "./products";
import Categories from "./categories";
import ParamAnimatedTabs from "@/components/param/animated-tab";
import Vendors from "./vendors";

export default function Admin() {
  return (
    <ParamAnimatedTabs
      options={[
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
