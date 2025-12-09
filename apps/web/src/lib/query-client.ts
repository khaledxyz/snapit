import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { toastManager } from "@/components/ui/toast";

// ============================================================================
// Error Handling
// ============================================================================

const handleQueryError = (error: Error) => {
  if (
    error.message.includes("Network") ||
    error.message.includes("Failed to fetch")
  ) {
    toastManager.add({
      title: "Network Error",
      description: "Please check your connection.",
      type: "error",
    });
    return;
  }

  toastManager.add({
    title: "Unexpected Error",
    description: error.message || "Something went wrong. Please try again.",
    type: "error",
  });
};

const handleMutationError = (error: Error) => error;

// ============================================================================
// Query Client Configuration
// ============================================================================

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => handleQueryError(error as Error),
  }),

  mutationCache: new MutationCache({
    onError: (error) => handleMutationError(error as Error),
  }),

  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: (failureCount, error) => {
        const msg = (error as Error).message;
        if (msg.includes("4")) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (i) => Math.min(1000 * 2 ** i, 30_000),
      networkMode: "online",
    },

    mutations: {
      retry: (failureCount, error: unknown) => {
        if (
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error &&
          typeof (error as { statusCode: number }).statusCode === "number"
        ) {
          const statusCode = (error as { statusCode: number }).statusCode;
          if (statusCode >= 400 && statusCode < 500) {
            return false; // do not retry client errors like 409
          }
        }
        return failureCount < 1; // retry once for other errors
      },
      networkMode: "online",
    },
  },
});

// ============================================================================
// Prefetch Helper
// ============================================================================

export const prefetchQuery = async <T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>
) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: 60 * 1000,
  });
};

// ============================================================================
// Optimistic Update Helpers
// ============================================================================

export const optimisticUpdate = <T>(
  queryKey: readonly unknown[],
  updater: (old: T | undefined) => T
) => {
  queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T>(queryKey);

  try {
    queryClient.setQueryData<T>(queryKey, updater(previousData));
  } catch (err) {
    console.error("Optimistic update failed:", err);
    return () =>
      console.warn("No rollback available for this optimistic update");
  }

  return () => {
    queryClient.setQueryData(queryKey, previousData);
  };
};

// ============================================================================
// Cache Utilities
// ============================================================================

export const clearAllCache = () => {
  queryClient.clear();
};

export const invalidateByPrefix = (prefix: string) => {
  queryClient.invalidateQueries({
    predicate: (query) => {
      const key = Array.isArray(query.queryKey) ? query.queryKey[0] : undefined;
      return typeof key === "string" && key.startsWith(prefix);
    },
  });
};
