import { useQuery, UseQueryOptions, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { api } from '@/lib/api';
import { authQueryKeys, LoginInput } from './constants';
import { User } from '../user/constants';

export const useUser = (options?: UseQueryOptions<User, Error>) => {
    return useQuery<User, Error>({
        queryKey: authQueryKeys.details(),
        queryFn: async () => {
            const res = await api.get<User>('/auth/me');
            if (res.error) {
                throw new Error(res.error);
            }
            if (!res.data) {
                throw new Error('No user data returned');
            }
            return res.data;
        },
        retry: false, // Don't retry auth failures
        staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
        ...options,
    });
};

export const useLogin = (options?: UseMutationOptions<User, Error, LoginInput>) => {
    return useMutation<User, Error, LoginInput>({
        mutationFn: async (payload) => {
            const res = await api.post<User>('/auth/login', payload);
            if (res.error) {
                throw new Error(res.error);
            }
            if (!res.data) {
                throw new Error('No user data returned');
            }
            return res.data;
        },
        onSuccess: (data, variables, context) => {
            // Invalidate and refetch user data after successful login
            queryClient.invalidateQueries({ queryKey: authQueryKeys.details() });
            queryClient.setQueryData(authQueryKeys.details(), data);
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
};

export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
    return useMutation<void, Error, void>({
        mutationFn: async () => {
            const res = await api.post<{ message: string }>('/auth/logout');
            if (res.error) {
                throw new Error(res.error);
            }
            return;
        },
        onSuccess: (data, variables, context) => {
            // Invalidate user data after logout
            queryClient.invalidateQueries({ queryKey: authQueryKeys.details() });
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
};