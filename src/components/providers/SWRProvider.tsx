'use client';

import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: React.ReactNode;
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then(res => res.json()),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
        dedupingInterval: 30000, // 30 seconds
        errorRetryCount: 2,
        errorRetryInterval: 10000,
        focusThrottleInterval: 5000,
        loadingTimeout: 3000,
        keepPreviousData: true,
        compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
      }}
    >
      {children}
    </SWRConfig>
  );
}
