import FormInput from "@/components/form/input"; 
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRequest } from "@/hooks/useRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ControlName = ({
  open,
  setOpen,
  current,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  current: Category | undefined;
}) => {
  const queryClient = useQueryClient();

  const { post, patch, isPending } = useRequest({
    onSuccess: (res: any) => {
      if (current?.id) {
        queryClient.setQueryData(
          ["category/"],
          (oldData: Category[]) =>
            oldData?.map((o) => (o.id == current?.id ? res : o))
        );
        toast.success("Muvaffaqiyatli tahrirlandi");
      } else {
        queryClient.setQueryData(
          ["category/"],
          (oldData: Category[]) => [...oldData, res]
        );
        toast.success("Muvaffaqiyatli tahrirlandi");
      }
      setOpen(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    disabled: isPending,
    values: {
      name_fa: current?.name_fa || "",
      name_uz: current?.name_uz || "",
    } as any,
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = {
      name_fa: data.name_fa,
      name_uz: data.name_uz,
    };
    if (current?.id) {
      await patch(`category/${current?.id}/`, formData);
    } else {
      await post("category/", formData);
    }
  }

  useEffect(() => {
    if (!open) {
      form.reset({
        name_fa: current?.name_fa || "",
        name_uz: current?.name_uz || "",
      });
    }
  }, [open, current, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{current?.id ? "Tahrirlash" : "Qo'shish"}</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              {current?.id ? "Tahrirlash" : "Qo'shish"}
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormInput methods={form} name="name_fa" label="Nomi (Dari)" />
          <FormInput methods={form} name="name_uz" label="Nomi (Uzbek)" />
          <div className="flex gap-4 justify-end">
            <Button loading={isPending}>Saqlash</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Bekor qilish
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ControlName;

const formSchema = z.object({
  name_fa: z
    .string({ message: "Nomi kiritilishi shart (Dari)" })
    .min(1, { message: "Nomi kiritilishi shart (Dari)" }),
  name_uz: z
    .string({ message: "Nomi kiritilishi shart (Uzbek)" })
    .min(1, { message: "Nomi kiritilishi shart (Uzbek)" }),
});
