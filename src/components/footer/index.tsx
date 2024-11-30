import { Heart, Home, List, ShoppingCart } from "lucide-react";
import AnimatedFooterTab from "../custom/footer-tabs";
import { useStore } from "@/hooks/useStore";
import { useGet } from "@/hooks/useGet";

export default function Footer() {
    const {store:baskets}=useStore<Product[]>("baskets");
    const {data:likeds}=useGet<Product[]>("user/favourite/",undefined,{enabled:!!localStorage.getItem("token")});
  return (
    <footer className="sm:hidden sticky bottom-0 backdrop-blur bg-background/60 px-2 sm:px-4">
        <AnimatedFooterTab options={[
            {
                name:'Bosh sahifa',
                id:'/',
                icon:<Home width={25}/>,
            },
            {
                name:"Kategoriyalar",
                id:"/categories",
                icon:<List width={25}/>
            },
            {
                name:"Tanlanganlar",
                id:"/likeds",
                icon:<Heart width={25}/>,
                badge:likeds?.length
            },
            {
                name:"Savat",
                id:"/basket",
                icon:<ShoppingCart width={25}/>,
                badge:baskets?.length
            },
        ]}/>
    </footer>
  )
}
