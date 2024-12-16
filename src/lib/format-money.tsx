import { ClassNameValue } from "tailwind-merge";
import { useTranslation } from "react-i18next";

export function formatMoney(
  amount?: number | string,
  className?: ClassNameValue,
  suffix?: boolean
) {
  const [integerPart, decimalPart] = amount ? amount.toString().split(".") : "";
  const newIntegerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const { t } = useTranslation();
  if (amount) {
    if (decimalPart && +decimalPart > 0) {
      return (
        <span className={`${className} text-nowrap`} dir="ltr">
          {newIntegerPart}.{decimalPart} {suffix ? `${t("so'm")}` : ""}
        </span>
      );
    } else {
      return (
        <span className={`${className} text-nowrap`} dir="ltr">
          {newIntegerPart} {suffix ? `${t("so'm")}` : ""}
        </span>
      );
    }
  } else {
    return (
      <span className={`${className} text-nowrap`} dir="ltr">
        0 {suffix ? `${t("so'm")}` : ""}
      </span>
    );
  }
}
