import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/form/input";
import { useRequest } from "@/hooks/useRequest";
import { toast } from "sonner";

export default function ChangePassword() {
  const { isPending,patch } = useRequest();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    disabled: isPending,
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await patch("user/", data);
    toast.success("Muvaffaqiyatli o'zgartirildi");
  }

  return (
      <Card className="w-full max-w-full sm:max-w-sm">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
            <FormInput
              name="old_password"
              label="Parol"
              type="password"
              methods={form}
            />
            <FormInput
              name="new_password"
              label="Parolni qayta kiriting"
              type="password"
              methods={form}
            />
            <Button type="submit" loading={isPending} className="w-full">
              O'zgartirish
            </Button>
          </form>
        </CardContent>
      </Card>
  );
}

const FormSchema = z
  .object({
    old_password: z
      .string({ message: "Parolingizni kiriting kiriting" })
      .min(1, "Parolingizini kiriting"),
    new_password: z
      .string({ message: "Parolni qayta kiriting" })
      .min(1, "Parolingizni qayta kiriting"),
  })
  .superRefine(({ old_password, new_password }, ctx) => {
    if (old_password !== new_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parolingiz mos kelmadi",
        path: ["retype"],
      });
    }
  });
