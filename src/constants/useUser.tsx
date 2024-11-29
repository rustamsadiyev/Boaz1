import { useGet } from "@/hooks/useGet";

export function useUser() {
  const { data, refetch } = useGet<{ username: string; is_admin: boolean }>(
    "user/"
  );
  return { username: data?.username, is_admin: data?.is_admin, refetch };
}
