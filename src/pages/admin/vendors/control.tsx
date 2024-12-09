import FormInput from "@/components/form/input";
import FormImagePicker from "../../../components/form/image-picker"; 
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRequest } from "@/hooks/useRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
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
          ["vendor/"],
          (oldData: Category[]) => oldData?.map((o) =>
            o.id == current?.id ? res : o
          )
        );
        toast.success("Muvaffaqiyatli tahrirlandi");
      } else {
        queryClient.setQueryData(
          ["vendor/"],
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
      ...current,
    } as any,
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append("name", data.name);
    if (data.image) {
      formData.append("image", data.image);
    }

    if (current?.id) {
      await patch(`vendor/${current?.id}/`, formData, {
        contentType: "multipart/form-data",
      });
    } else {
      await post("vendor/", formData, {
        contentType: "multipart/form-data",
      });
    }
  }

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

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

          <FormImagePicker
            methods={form}
            name="image"
            label="Rasm"
            avatar={true}
          />

          <FormInput methods={form} name="name" label="Nomi" />

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
  name: z
    .string({ message: "Nomi kiritilishi shart" })
    .min(1, { message: "Nomi kiritilishi shart" }),
  image: z
    .instanceof(File, { message: "Rasm yuklashingiz kerak" })
    .optional(),
});