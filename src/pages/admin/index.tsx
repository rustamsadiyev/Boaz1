import Products from "./products";
import Categories from "./categories";
import ParamAnimatedTabs from "@/components/param/animated-tab";
import Vendors from "./vendors";
import Orders from "./orders";
import { useTranslation } from "react-i18next";

export default function Admin() {
  const { t } = useTranslation();
  return (
    <>
    <ParamAnimatedTabs
      options={[
        {
          name: t("Buyurtmalar"),
          id:"orders",
          content:<Orders/>
        },
        {
          name: t("Maxsulotlar"),
          id: "products",
          content: <Products />,
        },
        {
          name: t("Kategoriyalar"),
          id: "categories",
          content: <Categories />,
        },
        {
          name:t("Firmalar"),
          id:"companies",
          content:<Vendors/>
        }
      ]}
    />
    </>

  );
}