import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuthStorage } from '@/modules/auth/features/lib/auth-storage';
import { tokenRefreshed, userLoggedOut } from '@/modules/auth/features/stores/authStore';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
});

const baseQueryWithReauth = async (args: Parameters<typeof rawBaseQuery>[0], api: Parameters<typeof rawBaseQuery>[1], extraOptions: Parameters<typeof rawBaseQuery>[2]) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);
    const data = refreshResult.data as { success?: boolean; data?: { accessToken?: string } } | undefined;

    if (data?.success && data?.data?.accessToken) {
      api.dispatch(tokenRefreshed({ token: data.data.accessToken }));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      clearAuthStorage();
      api.dispatch(userLoggedOut());
      return refreshResult.error ? refreshResult : result;
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Layout', 'User', 'Course', 'Category'],
  endpoints: () => ({}),
});

const apiWithAuth = api.injectEndpoints({
  endpoints: (builder) => ({
    refreshToken: builder.mutation<{ data: { accessToken: string } }, void>({
      query: () => ({ url: '/auth/refresh', method: 'POST' }),
    }),
  }),
});

export const { useRefreshTokenMutation } = apiWithAuth;
