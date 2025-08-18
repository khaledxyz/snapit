import { queryClient } from "@/lib/query-client";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateShortUrlInput, ShortUrl, urlsQueryKeys } from "./constants";

export const useCreateShortUrl = (
  options?: UseMutationOptions<ShortUrl, Error, CreateShortUrlInput>,
) => {
  return useMutation<ShortUrl, Error, CreateShortUrlInput>({
    mutationFn: async (payload) => {
      const res = await api.post<ShortUrl>("/urls", payload);
      if (res.error)
        throw new Error(`Failed to create short URL: ${res.error}`);
      if (!res.data) throw new Error("No data returned from API");
      return res.data;
    },
    onSuccess: (data, variables, context) => {
      const savedUrls = JSON.parse(
        localStorage.getItem("shortenedUrls") || "[]",
      );
      localStorage.setItem(
        "shortenedUrls",
        JSON.stringify([...savedUrls, data]),
      );
      queryClient.invalidateQueries({ queryKey: urlsQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useGetUserUrls = (
  options?: UseQueryOptions<ShortUrl[], Error>,
) => {
  return useQuery<ShortUrl[], Error>({
    queryKey: urlsQueryKeys.lists(),
    queryFn: async () => {
      const res = await api.get<ShortUrl[]>("/urls");
      if (res.error) throw new Error(`Failed to fetch URLs: ${res.error}`);
      if (!res.data) return [];
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    ...options,
  });
};

export const useDeleteUrl = (
  options?: UseMutationOptions<void, Error, string>,
) => {
  return useMutation<void, Error, string>({
    mutationFn: async (shortCode) => {
      const res = await api.delete(`/urls/${shortCode}`);
      if (res.error) throw new Error(`Failed to delete URL: ${res.error}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: urlsQueryKeys.lists() });
      const savedUrls = JSON.parse(
        localStorage.getItem("shortenedUrls") || "[]",
      );
      const updatedUrls = savedUrls.filter(
        (url: ShortUrl) => url.id !== variables,
      );
      localStorage.setItem("shortenedUrls", JSON.stringify(updatedUrls));
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
