'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { Toaster } from 'sonner';

import Layout from '@/components/layout/layout';

import { I18nProvider } from '@/services/providers/i18n-provider';
import { ThemeProvider } from '@/services/providers/theme-provider';
import { store } from '@/services/redux/store';

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: ProviderProps) => {
  return (
    <I18nProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ReduxProvider store={store}>
          <Layout>{children}</Layout>
          <Toaster position="bottom-center" richColors />
        </ReduxProvider>
      </ThemeProvider>
    </I18nProvider>
  );
};
