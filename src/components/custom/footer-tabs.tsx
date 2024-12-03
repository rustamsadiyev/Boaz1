import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { Badge } from "../ui/badge";

export default function AnimatedFooterTab({
  options,
  value,
  returnValue = "id",
  header,
  fullWidth,
  wrapperClassName,
}: TabsProps) {
  const tabRef = useRef<HTMLDivElement | null>(null);
  const [currentTab, setCurrentTab] = useState<number | string>(
    value || options?.[0]?.[returnValue]
  );
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const navigate = useNavigate();

  const updateIndicator = () => {
    if (tabRef.current) {
      const activeTab = tabRef.current.querySelector(
        `button[data-index="${value || currentTab}"]`
      );
      if (activeTab) {
        const { width, left } = (
          activeTab as HTMLElement
        ).getBoundingClientRect();
        const parentLeft = tabRef.current.getBoundingClientRect().left;
        setIndicatorStyle({ width, left: left - parentLeft });
      }
    }
  };

  useEffect(() => {
    updateIndicator();
    const resizeObserver = new ResizeObserver(updateIndicator);
    if (tabRef.current) {
      resizeObserver.observe(tabRef.current as Element);
    }
    return () => resizeObserver.disconnect();
  }, [currentTab, options, value]);

  return (
    <Tabs
      defaultValue={options[0]?.id.toString()}
      value={value?.toString() || currentTab.toString()}
      className={cn("relative overflow-auto h-14 flex", wrapperClassName)}
      ref={tabRef}
      onValueChange={(value) => {
        setCurrentTab(value);
        navigate({ to: `${value}` });
      }}
    >
      <div className="flex items-center w-full overflow-auto">
        <TabsList
          className={cn(
            "relative w-full flex items-center justify-between h-14 -mb-1 !bg-transparent pt-2",
            fullWidth && "grid grid-cols-2"
          )}
        >
          {options.map((t, i) => (
            <Link to={t.id.toString()} key={i}>
              <TabsTrigger
                key={i}
                data-index={t?.[returnValue]}
                value={t.id.toString()}
                className={cn(
                  "!bg-transparent relative duration-300 z-20 ease-out -ml-1 flex flex-col !shadow-none !p-0 py-2 !px-2 data-[state=active]:text-primary",
                  fullWidth && "ml-0"
                )}
              >
                {t.icon}
                <span className="text-[10px] -mt-1">{t.name}</span>
                {!!t.badge && (
                  <Badge className="absolute -top-0.5 right-0 px-1 h-4 text-[10px]">
                    {t.badge}
                  </Badge>
                )}
              </TabsTrigger>
            </Link>
          ))}
          <div
            className="absolute top-0 h-1 bg-primary rounded-md duration-300 -ml-0.5"
            style={{
              width: `${indicatorStyle.width}px`,
              transform: `translateX(${indicatorStyle.left}px)`,
            }}
          />
        </TabsList>
        {header}
      </div>
      {options?.map((t) => (
        <TabsContent key={t.id} value={t.id.toString()}>
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

interface TabsProps {
  options: {
    name: string | number;
    id: string | number;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    badge?: number;
  }[];
  value?: string | number;
  setValue?: (val: string | number) => void;
  returnValue?: "name" | "id";
  header?: React.ReactNode;
  fullWidth?: boolean;
  wrapperClassName?: ClassNameValue;
}
