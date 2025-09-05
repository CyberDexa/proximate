'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Video, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Match {
  id: string;
  partner: {
    id: string;
    name: string;
    image?: string;
    isVerified: boolean;
  };
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  matchedAt: Date;
  consentConfirmed: boolean;
  videoVerified: boolean;
  hasActiveMeetup: boolean;
}

export default function MessagesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages');
      const data = await response.json();

      if (data.success) {
        setMatches(data.matches);
      } else {
        console.error('Failed to load matches:', data.error);
        // Fall back to empty array if no matches
        setMatches([]);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground">
              {matches.length} {matches.length === 1 ? 'conversation' : 'conversations'}
            </p>
          </div>
          
          <Button variant="outline" className="text-emerald-500 border-emerald-500/20">
            <Shield className="h-4 w-4 mr-2" />
            Safety Center
          </Button>
        </div>
      </div>

      {/* Active Meetups Banner */}
      {matches.some(m => m.hasActiveMeetup) && (
        <Card className="mb-4 p-4 bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-medium text-emerald-600">Active Meetup</h3>
              <p className="text-sm text-emerald-600/80">
                You have an active meetup with safety protocols enabled
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Messages List */}
      <div className="space-y-3">
        {matches.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground">
              Start swiping to find matches and begin conversations
            </p>
            <Button 
              className="mt-4"
              onClick={() => router.push('/discover')}
            >
              Start Discovering
            </Button>
          </Card>
        ) : (
          matches.map((match) => (
            <Card 
              key={match.id} 
              className="p-4 hover:bg-card/80 transition-colors cursor-pointer"
              onClick={() => router.push(`/messages/${match.id}`)}
            >
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={match.partner.image || '/placeholder-avatar.jpg'}
                    alt={match.partner.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {match.partner.isVerified && (
                    <Badge className="absolute -bottom-1 -right-1 h-4 w-4 p-0 bg-emerald-500">
                      ✓
                    </Badge>
                  )}
                  {match.hasActiveMeetup && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {match.partner.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {match.videoVerified && (
                        <Video className="h-3 w-3 text-blue-500" />
                      )}
                      {match.consentConfirmed && (
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                      )}
                      {match.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(match.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {match.lastMessage ? (
                        <>
                          {match.lastMessage.senderId === 'current-user-id' && (
                            <span className="text-blue-500 mr-1">You:</span>
                          )}
                          {truncateMessage(match.lastMessage.content)}
                        </>
                      ) : (
                        <span className="italic">No messages yet</span>
                      )}
                    </p>

                    <div className="flex items-center space-x-2">
                      {match.hasActiveMeetup && (
                        <Badge className="bg-blue-500/20 text-blue-600 text-xs">
                          <Shield className="h-2 w-2 mr-1" />
                          Active
                        </Badge>
                      )}
                      
                      {match.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs min-w-5 h-5 flex items-center justify-center rounded-full">
                          {match.unreadCount > 9 ? '9+' : match.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Safety Status Indicators */}
                  <div className="flex items-center space-x-2 mt-2">
                    {match.consentConfirmed && (
                      <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600">
                        Consent ✓
                      </Badge>
                    )}
                    {match.videoVerified && (
                      <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600">
                        Video ✓
                      </Badge>
                    )}
                    {!match.consentConfirmed && !match.videoVerified && (
                      <Badge variant="secondary" className="text-xs">
                        New Match
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Safety Notice */}
      <Card className="mt-6 p-4 bg-amber-500/5 border-amber-500/20">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-600">
            <p className="font-medium mb-1">Safety Reminder:</p>
            <p className="text-xs">
              Always meet in public places, share your location with trusted friends, 
              and use our safety tools. Report any inappropriate behavior immediately.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
