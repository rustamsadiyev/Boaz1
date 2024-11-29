import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormInput from "@/components/form/input";
import { useState } from "react";
import axios from "axios";
import ParamAnimatedTabs from "@/components/param/animated-tab";
import { useUser } from "@/constants/useUser";

export const Route = createFileRoute("/_auth/auth")({
  component: AuthComponent,
});

function AuthComponent() {
  const [loading, setLoading] = useState(false);
  const search: any = useSearch({ from: "/_auth/auth" });
  const LastSchema = search.page_tabs === "register" ? FormSchema2 : FormSchema;
  const form = useForm<z.infer<typeof LastSchema>>({
    resolver: zodResolver(LastSchema),
    disabled: loading,
  });

  const navigate = useNavigate();

  const { refetch } = useUser();

  async function onSubmit(data: z.infer<typeof LastSchema>) {
    try {
      setLoading(true);
      if (search.page_tabs === "register") {
        const { status } = await axios.post(
          import.meta.env.VITE_DEFAULT_URL + "user/",
          data
        );
        if (status === 201) {
          navigate({ search: undefined });
        }
      } else {
        const { data: res, status } = await axios.post(
          import.meta.env.VITE_DEFAULT_URL + "token/",
          data
        );
        if (status === 200) {
          localStorage.setItem("token", res.access);
          localStorage.setItem("refresh", res.refresh);
          refetch();
          navigate({ to: "/" });
        }
      }
    } catch (error: any) {
      toast.error(
        error.response.data.detail ||
          (search.page_tabs === "register"
            ? "Bunday user mavjud"
            : "Bunday user mavjud emas")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[88vh] items-center justify-center px-4">
      <ParamAnimatedTabs
        wrapperClassName="w-full max-w-sm h-[530px]"
        onValueChange={() => form.reset()}
        options={[
          {
            name: "Kirish",
            id: "login",
            content: (
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-2xl text-center">
                    Kirish
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" space-y-4"
                  >
                    <FormInput name="username" label="Login" methods={form} />
                    <FormInput
                      name="password"
                      label="Parol"
                      type="password"
                      methods={form}
                    />
                    <Button type="submit" loading={loading} className="w-full">
                      Kirish
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ),
          },
          {
            name: "Ro'yxatdan o'tish",
            id: "register",
            content: (
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-2xl text-center">
                    Ro'yxatdan o'tish
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" space-y-4"
                  >
                    <FormInput
                      methods={form}
                      name="full_name"
                      label="To'liq ismi"
                    />
                    <FormInput name="username" label="Login" methods={form} />
                    <FormInput
                      name="password"
                      label="Parol"
                      type="password"
                      methods={form}
                    />
                    <FormInput
                      name="retype"
                      label="Parolni qayta kiriting"
                      type="password"
                      methods={form}
                    />
                    <Button type="submit" loading={loading} className="w-full">
                      Ro'yxatdan o'tish
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ),
          },
        ]}
        fullWidth
      />
    </div>
  );
}

const FormSchema = z.object({
  username: z
    .string({ message: "Loginingizni kiriting" })
    .min(1, "Loginingizni kiriting"),
  password: z
    .string({ message: "Parolingizni kiriting kiriting" })
    .min(1, "Parolingizini kiriting"),
});

const FormSchema2 = z
  .object({
    full_name: z
      .string({ message: "Ismingizni kiriting" })
      .min(1, "Ismingizni kiriting"),
    username: z
      .string({ message: "Loginingizni kiriting" })
      .min(1, "Loginingizni kiriting"),
    password: z
      .string({ message: "Parolingizni kiriting kiriting" })
      .min(1, "Parolingizini kiriting"),
    retype: z
      .string({ message: "Parolni qayta kiriting" })
      .min(1, "Parolingizni qayta kiriting"),
  })
  .superRefine(({ password, retype }, ctx) => {
    if (password !== retype) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parolingiz mos kelmadi",
        path: ["retype"],
      });
    }
  });
