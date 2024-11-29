import { useNavigate, useSearch } from "@tanstack/react-router";
import AnimatedTabs from "../custom/tabs";
import { ClassNameValue } from "tailwind-merge";

interface ParamTabsProps {
  options: {
    id: string | number;
    name: string | number;
    content?: React.ReactNode;
  }[];
  paramName?: string;
  disabled?: boolean;
  onAdd?: () => void;
  cleanOthers?: boolean;
  returnValue?: "name" | "id";
  onValueChange?: (val: string | number) => void;
  fullWidth?: boolean;
  wrapperClassName?: ClassNameValue;
}

const ParamAnimatedTabs: React.FC<ParamTabsProps> = ({
  options,
  paramName = "page_tabs",
  disabled = false,
  onAdd,
  cleanOthers = false,
  returnValue = "id",
  onValueChange,
  fullWidth,
  wrapperClassName,
}) => {
  const navigate = useNavigate();
  const search: any = useSearch({ from: "__root__" }) as Record<
    string,
    string | undefined
  >;
  const currentTab = search[paramName] || options[0]?.[returnValue];

  const handleTabChange = (tab: string | number) => {
    onValueChange?.(tab);
    if (tab === "add") {
      onAdd?.();
    } else {
      if (disabled || tab === currentTab) return;
      cleanOthers
        ? navigate({ search: { [paramName]: tab } as any })
        : navigate({ search: { ...search, [paramName]: tab } as any });
    }
  };

  return (
    <AnimatedTabs
      options={options}
      fullWidth={fullWidth}
      value={currentTab}
      setValue={handleTabChange}
      wrapperClassName={wrapperClassName}
    />
  );
};

export default ParamAnimatedTabs;
