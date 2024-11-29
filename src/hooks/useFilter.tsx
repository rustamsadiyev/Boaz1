import { useSearch } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";

const useFilter = <T extends Record<string, any>>(data: T[] | undefined) => {
  const [filteredData, setFilteredData] = useState<T[]>(data || []);
  const params: any = useSearch({ from: "__root__" });

  const filtered = useMemo(() => {
    if (!data?.length || !params?.q) {
      return data || [];
    }

    const lowercasedQuery =
      typeof params.q !== "number" ? params?.q?.toLowerCase() : params.q;
    const keys = Object.keys(data[0]);

    return data.filter((item) =>
      keys.some((key) =>
        item[key]?.toString().toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [data, params?.q]);

  useEffect(() => {
    setFilteredData(filtered);
  }, [filtered]);

  return (filteredData || []) as T[];
};

export default useFilter;
