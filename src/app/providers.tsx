'use client';

declare global {
  interface Window {
    __MSW_WORKER_STARTED__?: boolean;
  }
}

import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());

  useEffect(() => {
    // Dev-only MSW (mock) start
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      if (!window.__MSW_WORKER_STARTED__) {
        import('@/lib/msw/browser').then(({ worker }) => {
          worker.start({ onUnhandledRequest: 'bypass' });
          window.__MSW_WORKER_STARTED__ = true;
        });
      }
    }
  }, []);

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster richColors />
    </QueryClientProvider>
  );
}
