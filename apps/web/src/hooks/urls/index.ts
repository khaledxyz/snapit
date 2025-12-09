import type { CreateUrlDto, CreateUrlResponse, UrlDto } from "@snapit/sdk";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import { urls } from "@snapit/sdk";
import { useMutation, useQuery } from "@tanstack/react-query";

import { toastManager } from "@/components/ui/toast";
import { invalidateByPrefix, optimisticUpdate } from "@/lib/query-client";
import { queryKeysFactory } from "@/lib/query-key-factory";

export const urlsQueryKeys = queryKeysFactory("urls");

export const useCreateUrl = (
  options?: UseMutationOptions<CreateUrlResponse, Error, CreateUrlDto>
) =>
  useMutation({
    mutationFn: async (payload: CreateUrlDto) => {
      const result = await urls.createUrl({ body: payload });
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from createUrl");
      }
      return result.data;
    },
    onSuccess: (newUrl) => {
      optimisticUpdate<UrlDto[]>(urlsQueryKeys.lists(), (old = []) => [
        ...old,
        newUrl,
      ]);
      invalidateByPrefix("urls");
    },
    ...options,
  });

export const useUserUrls = (options?: UseQueryOptions<UrlDto[], Error>) =>
  useQuery<UrlDto[], Error>({
    queryKey: urlsQueryKeys.lists(),
    queryFn: async () => {
      const result = await urls.getUserUrls();
      if (result.error) {
        throw result.error;
      }
      if (!result.data) {
        throw new Error("No data returned from getUserUrls");
      }
      return result.data;
    },
    ...options,
  });

export const useDeleteUrl = (
  options?: UseMutationOptions<void, Error, string>
) =>
  useMutation({
    mutationFn: async (code: string) => {
      const result = await urls.deleteUrl({ path: { code } });
      if (result.error) {
        throw result.error;
      }
    },
    onSuccess: () => {
      invalidateByPrefix("urls");
      toastManager.add({
        description: "URL deleted successfully.",
        title: "Success!",
        type: "success",
      });
    },
    ...options,
  });
