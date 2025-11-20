'use client';

import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useAuthInitializer } from './useAuthInitializer';

export function useUserAuth() {
  const { data: session, status } = useSession();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useAuthInitializer(); 

  // If we're still loading the session, return null
  if (status === "loading" || isLoading) {
    return null;
  }
  
  // If we have either a session or a user in Redux, we're authenticated
  if (session?.user || user) {
    return true;
  }

  // If we have no session and no user, we're not authenticated
  return false;
}
