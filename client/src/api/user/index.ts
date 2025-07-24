import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateUserInput, UpdateUserInput, User, usersQueryKeys } from "./constants";
import { queryClient } from "@/lib/query-client";
import { api } from "@/lib/api";

export const useCreateUser = (options?: UseMutationOptions<User, Error, CreateUserInput>) => {
    return useMutation<User, Error, CreateUserInput>({
        mutationFn: async (payload) => {
            const res = await api.post<User>("/users", payload);
            if (res.error) throw new Error(`Failed to create user: ${res.error}`);
            if (!res.data) throw new Error("No data returned from API");
            return res.data;
        },
        onSuccess: (data, variables, context) => {
            // Invalidate any user-related queries after successful creation
            queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() });
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
};

export const useDeleteUser = (options?: UseMutationOptions<void, Error, void>) => {
    return useMutation<void, Error, void>({
        mutationFn: async () => {
            const res = await api.delete("/users/me");
            if (res.error) throw new Error(`Failed to delete user: ${res.error}`);
        },
        onSuccess: (data, variables, context) => {
            // Clear all cached data after account deletion
            queryClient.clear();
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
};

export const useUpdateUser = (options?: UseMutationOptions<User, Error, UpdateUserInput>) => {
    return useMutation<User, Error, UpdateUserInput>({
        mutationFn: async (payload) => {
            const res = await api.patch<User>("/users/me", payload);
            if (res.error) throw new Error(`Failed to update user: ${res.error}`);
            if (!res.data) throw new Error("No data returned from API");
            return res.data;
        },
        onSuccess: (data, variables, context) => {
            // Invalidate user-related queries to refresh cached data
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["auth"] });
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
};

