'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  age: number;
  distance: number;
  blurredPhoto: string;
  intentions: string[];
  verified: boolean;
  availableNow: boolean;
  mutualInterests: number;
  lastActive: string;
  safetyScore: number;
}

interface UseDiscoveryOptions {
  instantMode?: boolean;
  maxDistance?: number;
  minAge?: number;
  maxAge?: number;
  intentions?: string[];
}

export function useDiscovery(options: UseDiscoveryOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [activeUsersNearby, setActiveUsersNearby] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (options.instantMode) {
        params.append('instantMode', 'true');
      }
      if (options.maxDistance) {
        params.append('maxDistance', options.maxDistance.toString());
      }
      if (options.minAge) {
        params.append('minAge', options.minAge.toString());
      }
      if (options.maxAge) {
        params.append('maxAge', options.maxAge.toString());
      }
      if (options.intentions && options.intentions.length > 0) {
        params.append('intentions', options.intentions.join(','));
      }

      // Fetch real users from API
      const response = await fetch(`/api/discover?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      if (data.success) {
        // For page 1, replace users; for subsequent pages, append
        if (page === 1) {
          setUsers(data.users);
        } else {
          setUsers(prev => [...prev, ...data.users]);
        }
        
        setActiveUsersNearby(data.activeUsersNearby);
        setHasMore(data.pagination.hasMore);
      } else {
        throw new Error(data.error || 'Failed to fetch users');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Discovery fetch error:', err);
      
      // Fallback: show empty state instead of crash
      setUsers([]);
      setActiveUsersNearby(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [options, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const likeUser = useCallback(async (userId: string) => {
    try {
      // Simulate API call
      const response = await fetch('/api/matches/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likedUserId: userId,
          intention: options.intentions?.[0] || 'ongoing'
        }),
      });

      const result = await response.json();
      
      // Remove user from list
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      // Check if it's a match
      if (result.match) {
        // In real implementation, show match celebration modal
        console.log('🎉 It\'s a match!', result.match);
        // You could emit an event here to show MatchCelebration component
      }
      
      console.log('Liked user:', userId);
    } catch (err) {
      console.error('Failed to like user:', err);
    }
  }, [options.intentions]);

  const passUser = useCallback(async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Remove user from list
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      console.log('Passed user:', userId);
    } catch (err) {
      console.error('Failed to pass user:', err);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    
    setPage(prev => prev + 1);
  }, [hasMore, loading]);

  // Reset page when options change
  useEffect(() => {
    setPage(1);
    setUsers([]);
  }, [options.instantMode, options.maxDistance, options.minAge, options.maxAge, JSON.stringify(options.intentions)]);

  return {
    users,
    loading,
    error,
    activeUsersNearby,
    hasMore,
    likeUser,
    passUser,
    loadMore,
    refetch: fetchUsers
  };
}
