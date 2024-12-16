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
import { useLanguage } from "@/components/custom/languageContext"; // Import the useLanguage hook

export default function Filter() {
    const navigate = useNavigate();
    const search: any = useSearch({ from: "__root__" });

    const { name } = useLanguage(); // Get the current selected language from context

    // Fetch categories
    const { data } = useGet<{
        id: number;
        name_fa: string;
        name_uz: string;
        vendors: { id: number; name_fa: string; name_uz: string; image: string | null }[];
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
                            {/* Display category name based on the selected language */}
                            {name === "name_uz" ? category.name_uz : name === "name_fa" ? category.name_fa : category.name_uz}
                        </AccordionTrigger>
                        <AccordionContent className="pl-1">
                            {category.vendors?.map((vendor) => (
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
                                    <span className="text-sm">
                                        {/* Display vendor name based on the selected language */}
                                        {name === "name_uz" ? vendor.name_uz : name === "name_fa" ? vendor.name_fa : vendor.name_uz}
                                    </span>
                                    <Check
                                        width={14}
                                        className={cn(
                                            "text-transparent",
                                            search.vendor === vendor.id && "text-indigo-600"
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