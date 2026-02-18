'use client';

import type { RootState } from '@/services/redux/store';
import type { IUser } from '@/modules/auth/features/types/auth';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@/modules/auth/features/lib/auth-storage';
import { userLoggedIn } from '@/modules/auth/features/stores/authStore';

/** Restores auth state from httpOnly cookies on mount (e.g. after page reload) */
export function useAuthenticated() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user && !token) {
      const stored = getUser();
      if (stored) dispatch(userLoggedIn({ token: 'session', user: stored as unknown as IUser }));
    }
  }, [dispatch, user, token]);

  return { token, user };
}
