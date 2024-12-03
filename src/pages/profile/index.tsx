import ParamAnimatedTabs from "@/components/param/animated-tab";
import ChangePassword from "./change-password";
import Likeds from "./likeds";

export default function Profile() {
  return (
    <ParamAnimatedTabs
      options={[
        {
          name: "Tanlanganlar",
          id: "favourites",
          content:<Likeds/>
        },
        {
          name: "Parolni o'zgartirish",
          id: "change-password",
          content:<ChangePassword/>
        },
      ]}
    />
  );
}
