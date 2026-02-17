import type { RegistrationByEmailData, RegistrationByPhoneData, VerifyOtpData, ResendOtpData, LoginByEmailData, LoginByPhoneData, ForgotPasswordData, ResetPasswordData, User } from '@/shared/types';

import { clearAuthStorage, saveAuthUser } from '../lib/auth-storage';
import { userLoggedIn, userLoggedOut, userRegistration } from '../../../../modules/auth/features/stores/authStore';
import { api } from '@/services/redux/api/api';
import { IUser } from '../types/auth';

/** Backend returns { success, data } */
type AuthData<T> = { success: boolean; data: T };

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerByEmail: builder.mutation<AuthData<User>, RegistrationByEmailData>({
      query: (body) => ({
        url: '/auth/register/email',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userRegistration({ token: 'pending' }));
        } catch {
          // Error handled by form / toast
        }
      },
    }),
    registerByPhone: builder.mutation<AuthData<User>, RegistrationByPhoneData>({
      query: (body) => ({
        url: '/auth/register/phone',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userRegistration({ token: 'pending' }));
        } catch {
          // Error handled by form / toast
        }
      },
    }),
    verifyOtp: builder.mutation<AuthData<{ user: User; accessToken: string; refreshToken: string }>, VerifyOtpData>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.user && data?.data?.accessToken) {
            dispatch(userLoggedIn({ token: data.data.accessToken, user: data.data.user as unknown as IUser }));
            saveAuthUser(data.data.user as Record<string, unknown>);
          }
        } catch {
          // Error handled by form / toast
        }
      },
    }),
    resendOtp: builder.mutation<AuthData<{ message: string }>, ResendOtpData>({
      query: (body) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body,
      }),
    }),
    loginByEmail: builder.mutation<AuthData<{ user: User; accessToken: string; refreshToken: string }>, LoginByEmailData>({
      query: (body) => ({
        url: '/auth/login/email',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.user && data?.data?.accessToken) {
            dispatch(userLoggedIn({ token: data.data.accessToken, user: data.data.user as unknown as IUser }));
            saveAuthUser(data.data.user as Record<string, unknown>);
          }
        } catch {
          // Error handled by form / toast
        }
      },
    }),
    loginByPhone: builder.mutation<AuthData<{ user: User; accessToken: string; refreshToken: string }>, LoginByPhoneData>({
      query: (body) => ({
        url: '/auth/login/phone',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.user && data?.data?.accessToken) {
            dispatch(userLoggedIn({ token: data.data.accessToken, user: data.data.user as unknown as IUser }));
            saveAuthUser(data.data.user as Record<string, unknown>);
          }
        } catch {
          // Error handled by form / toast
        }
      },
    }),
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch {
          // Still clear local state on network error
        } finally {
          clearAuthStorage();
          dispatch(userLoggedOut());
        }
      },
    }),
    forgotPassword: builder.mutation<{ success: boolean; data: { message: string } }, ForgotPasswordData>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<{ success: boolean; data: { message: string } }, ResetPasswordData>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),
    getMe: builder.query<AuthData<User>, void>({
      query: () => ({ url: '/users/me', method: 'GET' }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(userLoggedIn({ token: 'session', user: data.data as unknown as IUser }));
            saveAuthUser(data.data as Record<string, unknown>);
          }
        } catch {
          clearAuthStorage();
          dispatch(userLoggedOut());
        }
      },
    }),
  }),
});

export const { useRegisterByEmailMutation, useRegisterByPhoneMutation, useVerifyOtpMutation, useResendOtpMutation, useLoginByEmailMutation, useLoginByPhoneMutation, useLogoutMutation, useForgotPasswordMutation, useResetPasswordMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
