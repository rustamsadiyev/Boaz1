import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { ClassNameValue } from "tailwind-merge";
import {useTranslation} from "react-i18next"

export default function ParamInput({
  className,
  fullWidth,
  clearOthers = true,
}: ParamInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const params: any = useSearch({ from: "__root__" });

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {t, i18n} = useTranslation()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (newSearchTerm) {
        navigate({
          search: clearOthers
            ? ({
                q: newSearchTerm,
                name: params.name,
              } as any)
            : {
                ...params,
                q: newSearchTerm,
              },
        });
      } else {
        navigate({ search: { ...params, q: undefined, name: undefined } });
      }
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const searchValue = inputRef.current?.value;
      if (searchValue) {
        navigate({
          to:'/categories',
          search: clearOthers
            ? ({
                q: searchValue,
                name: searchValue,
              } as any)
            : {
                ...params,
                q: searchValue,
                name: searchValue,
              },
        });
      } else {
        navigate({ search: { ...params, q: undefined, name: undefined } });
      }
    }
  };

  useEffect(() => {
    if (params.name || params.q) {
      if (inputRef.current) {
        inputRef.current.value = params.q || params.name || "";
      }
    } else {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [params.name, params.q, inputRef.current]);

  return (
    <>
      <Input
        placeholder={t("qidirish")}
        type="search"
        className={`${className}`}
        fullWidth={fullWidth}
        ref={inputRef}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </>
  );
}

interface ParamInputProps {
  className?: ClassNameValue;
  fullWidth?: boolean;
  clearOthers?: boolean;
}
