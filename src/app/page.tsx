'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAgeVerificationStored } from '@/lib/age-verification';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if age verification is stored
    if (!isAgeVerificationStored()) {
      // Redirect to age verification if not verified
      router.push('/age-verification');
    } else {
      // If verified, redirect to main app (dashboard/discover)
      router.push('/discover');
    }
  }, [router]);

  // Loading state while checking verification
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-pulse">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full"></div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">ProxiMeet</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
