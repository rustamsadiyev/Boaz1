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
      toast.promise(http.delete("vendor/" + id + "/"), {
        loading: "O'chirilmoqda",
        success: () => {
          queryClient.setQueryData(["vendor/"], (oldData: Category[]) =>
            oldData?.filter((f) => f.id !== id)
          );
          return "Muvaffaqiyatli o'chirildi";
        },
      });
    }
  }
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
      cell: ({ row }) => (
        <div>
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
