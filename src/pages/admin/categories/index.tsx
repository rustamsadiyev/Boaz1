import { useColumns } from "./columns";
import { useState } from "react";
import { useGet } from "@/hooks/useGet";
import ControlName from "./control";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/custom/datatable";

export default function Categories() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<any>();

  const { data, isLoading } = useGet<Category[]>("category/", undefined, {
    enabled: !localStorage.getItem("titles"),
  });

  return (
    <div className="flex flex-col items-end gap-4">
      <Button icon={<Plus width={18} />} onClick={() => setOpen(true)}>
        Kategoriya
      </Button>
      <div className="w-full text-center">
        <DataTable
          columns={useColumns({
            onEdit: (val) => {
              setCurrent(val);
              setOpen(true);
            },
          })}
          data={data}
          loading={isLoading}
        />
      </div>
      <ControlName open={open} setOpen={setOpen} current={current} />
    </div>
  );
}
