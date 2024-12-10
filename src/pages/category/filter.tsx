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

    const { data } = useGet<{
        id: number;
        name: string;
        vendors: { id: number; name: string; image: string | null }[];
    }[]>("https://ecommerce-api.loongair.uz/api/v1/categories/");

    return (
        <Accordion
            type="single"
            collapsible
            value={search.category?.toString() || ""}
            className="w-full md:max-w-64 md:fixed md:top-32 bg-background rounded p-4"
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
            {data?.map((category) => (
                <AccordionItem value={category.id.toString()} key={category.id}>
                    <AccordionTrigger>
                        {category.name}
                    </AccordionTrigger>
                    <AccordionContent className="pl-2">
                        {category.vendors?.map((vendor) => (
                            <Link
                                search={{
                                    ...search,
                                    vendor: search.vendor === vendor.id ? undefined : vendor.id,
                                }}
                                className="text-muted-foreground flex items-center justify-between py-0.5"
                                activeProps={{
                                    className: "!text-primary",
                                }}
                                key={vendor.id}
                            >
                                {vendor.name}
                                <Check
                                    width={14}
                                    className={cn(
                                        "text-transparent",
                                        search.vendor === vendor.id && "!text-primary"
                                    )}
                                />
                            </Link>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
