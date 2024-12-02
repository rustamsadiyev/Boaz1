import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";

export const useColumns = ({
  onEdit,
}: {
  onEdit: (val: Category) => void;
}): ColumnDef<Category>[] => {
  return [
    {
      header: "№",
      cell: ({ row }) => (row.original.name ? row.index + 1 : ""),
    },
    {
      header: "Nomi",
      accessorKey: "name",
    },
    {
      header: " ",
      cell: ({ row }) => 
            <Button
              icon={<Edit width={18} />}
              size="sm"
              variant="ghost"
              className="!text-primary"
              onClick={() => onEdit(row.original)}
            />
    },
  ];
};
