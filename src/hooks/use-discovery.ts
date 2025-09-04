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

  // Mock data for development
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Alex',
      age: 26,
      distance: 0.8,
      blurredPhoto: '/api/placeholder/100/100',
      intentions: ['tonight', 'ongoing'],
      verified: true,
      availableNow: true,
      mutualInterests: 3,
      lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      safetyScore: 9.2
    },
    {
      id: '2',
      name: 'Sam',
      age: 24,
      distance: 1.2,
      blurredPhoto: '/api/placeholder/100/100',
      intentions: ['this week'],
      verified: true,
      availableNow: false,
      mutualInterests: 5,
      lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      safetyScore: 8.7
    },
    {
      id: '3',
      name: 'Jordan',
      age: 29,
      distance: 2.1,
      blurredPhoto: '/api/placeholder/100/100',
      intentions: ['ongoing'],
      verified: false,
      availableNow: true,
      mutualInterests: 2,
      lastActive: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      safetyScore: 7.8
    },
    {
      id: '4',
      name: 'Casey',
      age: 31,
      distance: 0.5,
      blurredPhoto: '/api/placeholder/100/100',
      intentions: ['tonight'],
      verified: true,
      availableNow: true,
      mutualInterests: 4,
      lastActive: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      safetyScore: 9.5
    },
    {
      id: '5',
      name: 'Riley',
      age: 27,
      distance: 3.2,
      blurredPhoto: '/api/placeholder/100/100',
      intentions: ['this week', 'ongoing'],
      verified: true,
      availableNow: false,
      mutualInterests: 1,
      lastActive: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      safetyScore: 8.9
    }
  ];

  const activeUsersNearby = mockUsers.filter(user => 
    user.availableNow && user.distance <= 1
  ).length;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredUsers = [...mockUsers];

      // Apply instant mode filter
      if (options.instantMode) {
        filteredUsers = filteredUsers.filter(user => 
          user.availableNow && user.distance <= 1
        );
      }

      // Apply distance filter
      if (options.maxDistance) {
        filteredUsers = filteredUsers.filter(user => 
          user.distance <= options.maxDistance!
        );
      }

      // Apply age filters
      if (options.minAge) {
        filteredUsers = filteredUsers.filter(user => user.age >= options.minAge!);
      }
      if (options.maxAge) {
        filteredUsers = filteredUsers.filter(user => user.age <= options.maxAge!);
      }

      // Apply intention filters
      if (options.intentions && options.intentions.length > 0) {
        filteredUsers = filteredUsers.filter(user =>
          user.intentions.some(intention => 
            options.intentions!.includes(intention)
          )
        );
      }

      // Sort by safety score and verification status
      filteredUsers.sort((a, b) => {
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return b.safetyScore - a.safetyScore;
      });

      setUsers(filteredUsers);
      setHasMore(false); // For mock data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [options]);

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
    // In real implementation, fetch next page
  }, [hasMore, loading]);

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
