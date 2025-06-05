'use client';

import dynamic from 'next/dynamic'

// Dynamically import InterfaceBuilderClient, disabling SSR
// This can help with large client-side components and may resolve chunk loading issues.
const InterfaceBuilderClient = dynamic(
  () => import('@/components/native-ui/InterfaceBuilderClient'),
  {
    ssr: false,
    // You could add a loading component here if needed, e.g.,
    // loading: () => <p>Loading Builder...</p>,
  }
)

export default function HomePage() {
  return <InterfaceBuilderClient />;
}
