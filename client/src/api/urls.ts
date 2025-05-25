import { queryClient } from '@/lib/query-client';
import { queryKeysFactory } from '@/lib/query-key-factory';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { api } from '@/lib/api';

const URLS_QUERY_KEY = "urls" as const;
export const urlsQueryKeys = queryKeysFactory(URLS_QUERY_KEY);

interface CreateUrlPayload {
  longUrl: string;
}

export interface UrlResponse {
  _id: string
  originalUrl: string
  clicks: number
  shortCode: string
  createdAt: string
  updatedAt: string
}

export const useCreateShortUrl = (options?: UseMutationOptions<UrlResponse, Error, CreateUrlPayload>) => {
  return useMutation<UrlResponse, Error, CreateUrlPayload>({
    mutationFn: async (payload) => {
      const res = await api.post<UrlResponse>("/urls", payload);
      if (res.error) throw new Error(`Failed to create short URL: ${res.error}`);
      if (!res.data) throw new Error("No data returned from API");
      return res.data;
    },
    onSuccess: (data, variables, context) => {
      const savedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
      localStorage.setItem('shortenedUrls', JSON.stringify([...savedUrls, data]));
      queryClient.invalidateQueries({ queryKey: urlsQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};