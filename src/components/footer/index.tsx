import {  Home, List, ShoppingCart, User, Warehouse } from "lucide-react";
import AnimatedFooterTab from "../custom/footer-tabs";
import { useStore } from "@/hooks/useStore";
import { useGet } from "@/hooks/useGet";
import { useUser } from "@/constants/useUser";

export default function Footer() {
    const {username}=useUser()
    const {store:baskets}=useStore<Product[]>("baskets");
    const {data:likeds}=useGet<{product_ids: number[]}>("user/favourite/?only_ids=true",undefined,{enabled:!!localStorage.getItem("token")});
  return (
    <footer className="sm:hidden sticky bottom-0 backdrop-blur bg-background/60 sm:px-4 z-50">
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
                name:"Ulgurchi",
                id:"/warehouse",
                icon:<Warehouse width={25}/>
            },
            {
                name:"Savatcha",
                id:"/basket",
                icon:<ShoppingCart width={25}/>,
                badge:baskets?.length
            },
            {
                name:"Profil",
                id:username? "/profile":"/auth",
                icon:<User width={25}/>,
                badge:likeds?.product_ids?.length
            },
        ]}/>
    </footer>
  )
}
