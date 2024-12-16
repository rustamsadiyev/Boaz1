import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/useConfirm";
import http from "@/lib/http";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
export const useColumns = ({
  onEdit,
}: {
  onEdit: (val: Category) => void;
}): ColumnDef<Category>[] => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const { t } = useTranslation();

  async function onDelete(id: number) {
    const isConfirmed = await confirm({
      title: `${t("O'chirilsinmi")}?`,
    });
    if (isConfirmed) {
      toast.promise(http.delete("category/" + id + "/"), {
        loading: `${t("O'chirilmoqda")}`,
        success: () => {
          queryClient.setQueryData(["category/"], (oldData: Category[]) =>
            oldData?.filter((f) => f.id !== id)
          );
          return `${t("muvaffaqiyatli o'chirildi")}`;
        },
      });
    }
  }

  return [
    {
      id: "index",
      header: () => <div className="text-center">№</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.index + 1}</div>
      ),
    },
    {
      id: "name_uz",
      header: () => <div className="text-center">Nomi (Uzbek)</div>,
      accessorKey: "name_uz",
      cell: ({ row }) => (
        <div className="text-center">{row.original.name_uz}</div>
      ),
    },
    {
      id: "name_fa",
      header: () => <div className="text-center">Nomi (Russian)</div>,
      accessorKey: "name_fa",
      cell: ({ row }) => (
        <div className="text-center">{row.original.name_fa}</div>
      ),
    },
    {
      id: "actions",
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