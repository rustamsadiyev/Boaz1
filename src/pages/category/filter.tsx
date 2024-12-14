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
            className="w-full md:max-w-64 md:fixed md:top-[16vh] bg-background rounded-lg p-4 shadow-md"
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
            {data
                ?.sort((a, b) => a.id - b.id)
                .map((category) => (
                    <AccordionItem value={category.id.toString()} key={category.id}>
                        <AccordionTrigger
                            className="text-lg font-semibold text-gray-800 py-3 px-6 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none"
                        >
                            {category.name}
                    </AccordionTrigger>
                    <AccordionContent className="pl-1">
                        {category.vendors?.map((vendor) => 
                            (vendor.id === category.id && (vendor.name || vendor.image)) || 
                            (vendor.id !== category.id && (vendor.name || vendor.image)) ? (
                                <Link
                                    search={{
                                        ...search,
                                        vendor: search.vendor === vendor.id ? undefined : vendor.id,
                                    }}
                                    className="flex items-center justify-between py-2 px-6 rounded-md text-gray-700 hover:bg-gray-50 mb-2 focus:outline-none"
                                    activeProps={{
                                        className: "text-indigo-600 bg-gray-50",
                                    }}
                                    key={vendor.id}
                                >
                                    <span className="text-sm">{vendor.name}</span>
                                    <Check
                                        width={14}
                                        className={cn(
                                            "text-transparent",
                                            search.vendor === vendor.id && "text-indigo-600"
                                        )}
                                    />
                                </Link>
                            ) : null
                        )}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}