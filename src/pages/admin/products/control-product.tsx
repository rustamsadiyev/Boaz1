import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "@/hooks/useRequest";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import FormInput from "@/components/form/input";
import { useGet } from "@/hooks/useGet";
import FormTextarea from "@/components/form/textarea";
import FormNumberInput from "@/components/form/number-input";
import FormCombobox from "@/components/form/combobox";
import FormImageDrop from "@/components/form/image-drop";

interface thisProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  current?: Product;
}
export default function ControlProduct({ open, setOpen, current }: thisProps) {
  const queryClient = useQueryClient();
  const search: any = useSearch({ from: "__root__" });
  const { data: vendors } = useGet<Category[]>("vendor/");
  const { data: category } = useGet<Category[]>("category/");
  const { post, patch, isPending } = useRequest(
    {
      onSuccess: (data) => {
        if (current?.id) {
          queryClient.setQueryData(
            ["product/"],
            (oldData: {
              pageParams: string[];
              pages: { next: string; previous: string; results: Product[] }[];
            }) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  results: page.results.map((product) =>
                    product.id === current.id ? data : product
                  ),
                })),
              };
            }
          );
        } else {
          queryClient.setQueryData(
            ["product/"],
            (oldData: {
              pageParams: string[];
              pages: { next: string; previous: string; results: Product[] }[];
            }) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: [
                  { next: null, previous: null, results: [data] },
                  ...oldData.pages,
                ],
              };
            }
          );
        }
      },
    },
    { contentType: "multipart/form-data" }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: current as any,
    disabled: isPending,
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (current?.id) {
      await patch("product/" + current.id + "/", {
        ...data,
        image1: typeof data.image1 === "string" ? undefined : data.image1,
        image2: typeof data.image2 === "string" ? undefined : data.image2,
        image3: typeof data.image3 === "string" ? undefined : data.image3,
        image4: typeof data.image4 === "string" ? undefined : data.image4,
      });
      toast.success("Muvaffaqiyatli tahrirlandi");
      setOpen(false);
      form.reset();
    } else {
      await post("product/", {
        ...data,
      });
      toast.success("Muvaffaqiyatli qo'shildi");
      setOpen(false);
      form.reset();
    }

    queryClient.invalidateQueries({
      queryKey: ["imb/contacts/", { ...search, tab: undefined }],
    });
  }

  useEffect(() => {
    if (!open) {
      form.reset();
    } else if (!current?.id) {
      form.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-left">
            {current?.id ? current?.name + " ni tahrirlash" : "Yangi maxsulot"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto px-0.5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <FormInput methods={form} name="name" label="Nomi" hideError />
            <FormNumberInput
              methods={form}
              name="price"
              label="Narxi"
              thousandSeparator=" "
            />
            <FormNumberInput
              methods={form}
              name="discounted_price"
              label="Chegirma narx"
              thousandSeparator=" "
            />
            <FormNumberInput methods={form} name="stock" label="Miqdori" />
            <FormCombobox
              methods={form}
              name="category"
              label="Kategoriya"
              options={category}
            />
            <FormCombobox
              methods={form}
              name="vendor"
              label="Sotuvchi"
              options={vendors}
            />
            <FormTextarea
              methods={form}
              name="description"
              label="Ma'lumot"
              hideError
            />
            <span />
            <FormImageDrop methods={form} name="image1" label="Rasm" />
            <FormImageDrop methods={form} name="image2" label="Rasm" />
            <FormImageDrop methods={form} name="image3" label="Rasm" />
            <FormImageDrop methods={form} name="image4" label="Rasm" />
          </div>
          <Button
            icon={current?.id ? <Edit2 width={18} /> : <Plus width={18} />}
            type="submit"
            loading={isPending}
            className="w-max ml-auto"
          >
            {current?.id ? "Tahrirlash" : "Qo'shish"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const FormSchema = z.object({
  name: z.string({ message: "" }).min(1),
  description: z.string({ message: "" }).min(1),
  price: z
    .string({ message: "" })
    .min(3, { message: "Narxi juda kam" })
    .or(z.number().min(3)),
  discounted_price: z
    .string({ message: "Narxi juda kam" })
    .min(3, { message: "Narxi juda kam" })
    .or(z.number().min(3)),
  stock: z.string({ message: "" }).min(1).or(z.number().min(1)),
  image1: z.union([
    z.string().url({ message: "Valid URL kiriting" }),
    z
      .instanceof(File, { message: "Rasm tanlang" })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "Rasm hajmi 5 MB dan kichik bo'lishi kerak"
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported"
      ),
  ]),
  image2: z.union([
    z.string().url({ message: "Valid URL kiriting" }),
    z
      .instanceof(File, { message: "Rasm tanlang" })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "Rasm hajmi 5 MB dan kichik bo'lishi kerak"
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported"
      ),
  ]),
  image3: z.union([
    z.string().url({ message: "Valid URL kiriting" }),
    z
      .instanceof(File, { message: "Rasm tanlang" })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "Rasm hajmi 5 MB dan kichik bo'lishi kerak"
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported"
      ),
  ]),
  image4: z.union([
    z.string().url({ message: "Valid URL kiriting" }),
    z
      .instanceof(File, { message: "Rasm tanlang" })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "Rasm hajmi 5 MB dan kichik bo'lishi kerak"
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported"
      ),
  ]),
  sold: z.string().or(z.number()).optional(),
  category: z.number({ message: "" }).min(1),
  vendor: z.number({ message: "" }).min(1),
});

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
