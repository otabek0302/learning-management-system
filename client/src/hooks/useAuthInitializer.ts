'use client';

import { useEffect, useState } from 'react';
import { store } from '@/redux/store';
import { apiSlice } from '@/redux/features/api/apiSlice';

export const useAuthInitializer = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const refreshResult = await store.dispatch(
                    apiSlice.endpoints.refreshToken.initiate(undefined, { forceRefetch: true })
                );

                if (!('error' in refreshResult)) {
                    await store.dispatch(
                        apiSlice.endpoints.loadUser.initiate(undefined, { forceRefetch: true })
                    );
                }
            } catch (err) {
                console.error('Auth init failed:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    return { isLoading };
};