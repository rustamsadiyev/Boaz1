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
import { useTranslation } from "react-i18next";

export function CategoryDrawer() {
  const { t } = useTranslation();
  return (
    <Drawer>
      <DrawerTrigger asChild className="md:hidden">
        <Button variant='secondary'>
        {t("Filter")}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen p-2">
        <DrawerHeader className="flex items-center justify-between p-0">
            <DrawerTitle>{t("Filter")}</DrawerTitle>
            <DrawerClose asChild className="-mr-2">
              <Button variant="link">{t("Bekor qilish")}</Button>
            </DrawerClose>
        </DrawerHeader>
        <Filter/>
        <DrawerFooter className="p-0">
            <DrawerClose asChild>
              <Button>{t("Ko'rsatish")}</Button>
            </DrawerClose>
          </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}