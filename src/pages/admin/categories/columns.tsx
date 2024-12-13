import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/useConfirm";
import http from "@/lib/http";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const useColumns = ({
  onEdit,
}: {
  onEdit: (val: Category) => void;
}): ColumnDef<Category>[] => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  async function onDelete(id: number) {
    const isConfirmed = await confirm({
      title: "O'chirilsinmi?",
    });
    if (isConfirmed) {
      toast.promise(http.delete("category/" + id + "/"), {
        loading: "O'chirilmoqda",
        success: () => {
          queryClient.setQueryData(["category/"], (oldData: Category[]) =>
            oldData?.filter((f) => f.id !== id)
          );
          return "Muvaffaqiyatli o'chirildi";
        },
      });
    }
  }

  return [
    {
      id: "index", // Added id for this column
      header: () => <div className="text-center">№</div>,
      cell: ({ row }) => (row.original.name ? row.index + 1 : ""),
    },
    {
      id: "name", // Added id for this column
      header: () => <div className="text-center">Nomi</div>,
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="text-center">{row.original.name}</div>
      ),
    },
    {
      id: "actions", // Added id for this column
      header: () => <div className="text-center"> </div>,
      cell: ({ row }) => (
        <div className="flex justify-center items-center space-x-2">
          <Button
            icon={<Edit width={18} />}
            size="sm"
            variant="ghost"
            className="!text-primary"
            onClick={() => onEdit(row.original)}
          />
          <Button
            icon={<Trash2 width={18} />}
            size="sm"
            variant="ghost"
            className="!text-destructive"
            onClick={() => onDelete(row.original.id)}
          />
        </div>
      ),
    },
  ];
};
