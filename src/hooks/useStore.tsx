import { useQueryClient, useQuery } from "@tanstack/react-query";

export function useStore<T = unknown>(key: string) {
  const queryClient = useQueryClient();

  const setStore = (data: T) => {
    queryClient.setQueryData([key], data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const { data: store } = useQuery<T>({
    queryKey: [key],
    queryFn: () => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },
  });

  return { store, setStore };
}
