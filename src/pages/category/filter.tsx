import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useGet } from "@/hooks/useGet";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Check } from "lucide-react";
export default function Filter() {
  const navigate = useNavigate();
  const search: any = useSearch({ from: "__root__" });
  const {data}=useGet<{category:{name:string,id:number},vendors:{name:string,id:number}[]}[]>("category/?with_vendors=true")
  return (
    <Accordion
      type="single"
      collapsible
      value={search.category?.toString() || ""}
      className="w-full md:max-w-64 md:fixed md:top-20 bg-background rounded p-4"
      onValueChange={(value) =>
        navigate({
          search: {
            ...search,
            vendor: undefined,
            category: value ? +value : undefined,
          } as any,
        })
      }
    >
      {data?.map((d) => (
        <AccordionItem value={d.category?.id?.toString()} key={d.category?.id}>
          <AccordionTrigger>{d.category?.name}</AccordionTrigger>
          <AccordionContent className="pl-2">
            {d?.vendors?.filter((v) => !!v?.id)?.map((v) => (
              <Link
                search={
                  { ...search, vendor: search.vendor == v?.id ? undefined : v.id } as any
                }
                className="text-muted-foreground flex items-center justify-between py-0.5"
                activeProps={{
                  className: "!text-primary",
                }}
                key={v.id}
              >
                {v.name}{" "}
                <Check width={14} className={cn('text-transparent', search.vendor == v?.id && "!text-primary")} />
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
