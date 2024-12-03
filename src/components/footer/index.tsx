import { Heart, Home, List, ShoppingCart, User, Warehouse } from "lucide-react";
import AnimatedFooterTab from "../custom/footer-tabs";
import { useStore } from "@/hooks/useStore";
import { useGet } from "@/hooks/useGet";

export default function Footer() {
    const {store:baskets}=useStore<Product[]>("baskets");
    const {data:likeds}=useGet<{product_ids: number[]}>("user/favourite/?only_ids=true",undefined,{enabled:!!localStorage.getItem("token")});
  return (
    <footer className="sm:hidden sticky bottom-0 backdrop-blur bg-background/60 sm:px-4">
        <AnimatedFooterTab options={[
            {
                name:'Bosh sahifa',
                id:'/',
                icon:<Home width={25}/>,
            },
            {
                name:"Ulgurchi",
                id:"/warehouse",
                icon:<Warehouse width={25}/>
            },
            {
                name:"Savat",
                id:"/basket",
                icon:<ShoppingCart width={25}/>,
                badge:baskets?.length
            },
            {
                name:"Kategoriyalar",
                id:"/categories",
                icon:<List width={25}/>
            },
            {
                name:"Profil",
                id:"/profile",
                icon:<User width={25}/>,
                badge:likeds?.product_ids?.length
            },
        ]}/>
    </footer>
  )
}
