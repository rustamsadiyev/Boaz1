import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

export default function AnimatedTabs({
  options,
  value,
  setValue,
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
      className={cn("relative overflow-auto", wrapperClassName)}
      ref={tabRef}
      onValueChange={(value) => {
        setCurrentTab(value);
        setValue?.(Number.isNaN(+value) ? value : +value);
      }}
    >
      <div className="flex items-center max-w-full w-full overflow-auto">
        <TabsList
          className={cn(
            "relative w-max flex items-center justify-between",
            fullWidth && "w-full grid grid-cols-2"
          )}
        >
          {options.map((t, i) => (
            <TabsTrigger
              key={i}
              data-index={t?.[returnValue]}
              value={t.id.toString()}
              className={cn(
                "delay-75 data-[state=active]:bg-transparent data-[state=active]:text-background duration-300 z-10 ease-out"
              )}
            >
              {t.name}
            </TabsTrigger>
          ))}
          <div
            className="absolute top-1 h-8 bg-primary rounded-md duration-300"
            style={{
              width: `${indicatorStyle.width}px`,
              transform: `translateX(${indicatorStyle.left}px)`,
              marginLeft: fullWidth ? "0" : "-4px",
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
  }[];
  value?: string | number;
  setValue?: (val: string | number) => void;
  returnValue?: "name" | "id";
  header?: React.ReactNode;
  fullWidth?: boolean;
  wrapperClassName?: ClassNameValue;
}