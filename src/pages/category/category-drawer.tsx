import {  SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Filter from "./filter"


export function CategoryDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild className="md:hidden">
        <Button variant='secondary'>
        Filtr
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen p-2">
        <DrawerHeader className="flex items-center justify-between p-0">
            <DrawerTitle>Filter</DrawerTitle>
            <DrawerClose asChild className="-mr-2">
              <Button variant="link">Bekor qilish</Button>
            </DrawerClose>
        </DrawerHeader>
        <Filter/>
        <DrawerFooter className="p-0">
            <DrawerClose asChild>
              <Button>Ko'rsatish</Button>
            </DrawerClose>
          </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}