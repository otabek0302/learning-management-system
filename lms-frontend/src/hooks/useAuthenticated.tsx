'use client';

import type { RootState } from '@/services/redux/store';
import type { IUser } from '@/modules/auth/features/types/auth';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '@/modules/auth/features/lib/auth-storage';
import { userLoggedIn } from '@/modules/auth/features/stores/authStore';
import { useLazyGetMeQuery } from '@/modules/auth/features/api/authApi';

/** Restores auth state from httpOnly cookies on mount (e.g. after page reload) */
export function useAuthenticated() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const [getMe, { isLoading }] = useLazyGetMeQuery();
  const hasTried = useRef(false);

  useEffect(() => {
    if (!user && !token) {
      const stored = loadAuthUser();
      if (stored) dispatch(userLoggedIn({ token: 'session', user: stored as unknown as IUser }));
    }
    if (hasTried.current) return;
    hasTried.current = true;
    getMe();
  }, [dispatch, getMe, user, token]);

  return { isLoading, token, user };
}
