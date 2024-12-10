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
import FormCheckbox from "@/components/form/checkbox";

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
    defaultValues: {
      is_best_client: false,
    },
  });

  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof LastSchema>) {
    try {
      setLoading(true);
      const isBestClient = data.is_best_client || false;
  
      if (search.page_tabs === "register") {
        const { status } = await axios.post(
          import.meta.env.VITE_DEFAULT_URL + "user/",
          { ...data, is_best_client: isBestClient }
        );
  
        if (status === 201) {
          // console.log("is_best_client:", isBestClient);
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
          navigate({ to: "/" });
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
        (search.page_tabs === "register"
          ? "Bunday user mavjud"
          : "Bunday user mavjud emas")
      );
    } finally {
      setLoading(false);
    }
  }
  
  function setIsBestClient(checked: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex h-[90vh] items-center justify-center px-4 overflow-hidden ">
      <ParamAnimatedTabs
        wrapperClassName="w-full max-w-full sm:max-w-sm h-[550px] overflow-hidden fixed "
        onValueChange={() => form.reset()}
        options={[
          {
            name: "Kirish",
            id: "login",
            content: (
              <Card className="w-full sm:max-w-sm overflow-y-hidden ">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-2xl text-center">
                    Kirish
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormInput name="username" label="Login" methods={form} />
                    <FormInput name="password" label="Parol" type="password" methods={form} />
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
              <Card className="w-full sm:max-w-sm overflow-y-hidden ">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-2xl text-center">
                    Ro'yxatdan o'tish
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 ">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormInput methods={form} name="full_name" label="To'liq ismi" />
                    <FormInput name="username" label="Login" methods={form} />
                    <FormInput name="password" label="Parol" type="password" methods={form} />
                    <FormInput name="retype" label="Parolni qayta kiriting" type="password" methods={form} />
                    <FormCheckbox methods={form} name="is_best_client" label="Ulgurji User"  onChange={(e) => setIsBestClient(e.target.checked)}  />
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
  username: z.string().min(1, "Loginingizni kiriting"),
  password: z.string().min(1, "Parolingizni kiriting kiriting"),
  is_best_client: z.boolean().optional().default(false)
});

const FormSchema2 = z.object({
  full_name: z.string().min(1, "Ismingizni kiriting"),
  username: z.string().min(1, "Loginingizni kiriting"),
  password: z.string().min(1, "Parolingizni kiriting"),
  retype: z.string().min(1, "Parolingizni qayta kiriting"),
  is_best_client: z.boolean().optional().default(false)
}).superRefine(({ password, retype }, ctx) => {
  if (password !== retype) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Parolingiz mos kelmadi",
      path: ["retype"],
    });
  }
});