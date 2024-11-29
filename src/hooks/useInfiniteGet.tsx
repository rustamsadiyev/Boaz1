import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import http from "@/lib/http";
import { AxiosProgressEvent } from "axios";
import { useInView } from "react-intersection-observer";
import { useSearch } from "@tanstack/react-router";

type UseInfiniteGetOptions<T> = Omit<
  UseInfiniteQueryOptions<T, Error>,
  "queryKey" | "queryFn" | "getNextPageParam" | "getPreviousPageParam"
>;

type PaginatedResponse<T> = {
  results: T[];
  next: string | null;
  previous: string | null;
};

export function useInfiniteGet<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  options?: UseInfiniteGetOptions<PaginatedResponse<T>>
): {
  data: T[];
  downloadProgress: number;
  ref: (node?: Element | null) => void;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
} {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { ref, inView } = useInView();
  const lastUrl = params
    ? [url, { ...params, q: undefined, page_tabs: undefined }]
    : [url];
  const query = useInfiniteQuery({
    queryKey: lastUrl,
    queryFn: async ({ pageParam = "" }) => {
      const response = await http.get(pageParam ? pageParam?.toString() : url, {
        params,
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setDownloadProgress(percentCompleted);
          }
        },
      });
      return response.data as PaginatedResponse<T>;
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      return lastPage.next;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.previous;
    },
    ...options,
  });

  useEffect(() => {
    if (inView && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [inView, query]);

  const combinedResults = useMemo(() => {
    return (
      (query.data as any)?.pages.flatMap(
        (page: PaginatedResponse<T>) => page.results
      ) || []
    );
  }, [query.data]);

  const search: any = useSearch({ from: "__root__" });
  return {
    data: combinedResults,
    downloadProgress,
    ref: search.q ? () => {} : ref,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
  };
}
