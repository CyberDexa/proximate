'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Shield, Video, Phone, MoreVertical, AlertTriangle, Send, Image, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConsentGate } from '@/components/messages/consent-gate';
import { VideoVerify } from '@/components/messages/video-verify';
import { SafetyTools } from '@/components/messages/safety-tools';

interface Message {
  id: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'photo' | 'location' | 'consent_request';
  expiresAt?: Date;
  readAt?: Date;
  createdAt: Date;
}

interface Match {
  id: string;
  userOne: {
    id: string;
    name: string;
    image?: string;
    isVerified: boolean;
  };
  userTwo: {
    id: string;
    name: string;
    image?: string;
    isVerified: boolean;
  };
  matchedAt: Date;
  consentConfirmed: boolean;
}

export default function MessagesPage() {
  const { matchId } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showConsentGate, setShowConsentGate] = useState(false);
  const [showVideoVerify, setShowVideoVerify] = useState(false);
  const [showSafetyTools, setShowSafetyTools] = useState(false);
  const [currentUserId] = useState('current-user-id'); // TODO: Get from auth
  const [disappearTimer, setDisappearTimer] = useState(24); // Hours
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load match and messages
  useEffect(() => {
    loadMatchData();
    loadMessages();
  }, [matchId]);

  const loadMatchData = async () => {
    // TODO: Implement API call
    const mockMatch: Match = {
      id: matchId as string,
      userOne: {
        id: 'user-1',
        name: 'Alex',
        image: '/placeholder-avatar.jpg',
        isVerified: true
      },
      userTwo: {
        id: 'user-2', 
        name: 'Sam',
        image: '/placeholder-avatar.jpg',
        isVerified: false
      },
      matchedAt: new Date(),
      consentConfirmed: true
    };
    setMatch(mockMatch);
  };

  const loadMessages = async () => {
    // TODO: Implement API call with disappearing messages
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'user-1',
        content: 'Hey! Great to match with you 😊',
        messageType: 'text',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: '2',
        senderId: 'current-user-id',
        content: 'Hi Alex! Looking forward to getting to know you',
        messageType: 'text',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        readAt: new Date(),
        createdAt: new Date(Date.now() - 5 * 60 * 1000)
      }
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: newMessage,
      messageType: 'text',
      expiresAt: new Date(Date.now() + disappearTimer * 60 * 60 * 1000),
      createdAt: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // TODO: Send to API
  };

  const handlePrivatePhotoShare = () => {
    setShowConsentGate(true);
  };

  const onConsentGranted = () => {
    setShowConsentGate(false);
    // TODO: Allow photo upload
  };

  const getOtherUser = () => {
    if (!match) return null;
    return match.userOne.id === currentUserId ? match.userTwo : match.userOne;
  };

  const formatTimeRemaining = (expiresAt?: Date) => {
    if (!expiresAt) return '';
    const hoursLeft = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)));
    return hoursLeft > 1 ? `${hoursLeft}h` : 'Expires soon';
  };

  const otherUser = getOtherUser();

  if (!match || !otherUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={otherUser.image || '/placeholder-avatar.jpg'}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {otherUser.isVerified && (
              <Badge className="absolute -bottom-1 -right-1 h-4 w-4 p-0 bg-emerald-500">
                ✓
              </Badge>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{otherUser.name}</h3>
            <p className="text-sm text-muted-foreground">
              Matched {new Date(match.matchedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Safety Button - Always Visible */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSafetyTools(true)}
            className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
          >
            <Shield className="h-4 w-4" />
          </Button>

          {/* Video Verify Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowVideoVerify(true)}
            className="text-blue-500 border-blue-500/20 hover:bg-blue-500/10"
          >
            <Video className="h-4 w-4" />
          </Button>

          {/* More Options */}
          <Button
            size="sm"
            variant="ghost"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Disappearing Messages Warning */}
      <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20">
        <div className="flex items-center justify-center space-x-2 text-sm text-amber-600">
          <Clock className="h-4 w-4" />
          <span>Messages disappear after {disappearTimer} hours</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMine = message.senderId === currentUserId;
          const timeRemaining = formatTimeRemaining(message.expiresAt);

          return (
            <div
              key={message.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${isMine ? 'order-1' : 'order-2'}`}>
                <Card className={`p-3 ${
                  isMine 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                    <span>
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {timeRemaining && (
                      <span className="text-amber-400">
                        {timeRemaining}
                      </span>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* No Screenshots Notice */}
      <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
        <div className="flex items-center justify-center space-x-2 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4" />
          <span>Screenshots are not allowed. Respect privacy and consent.</span>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrivatePhotoShare}
            className="text-purple-500 border-purple-500/20 hover:bg-purple-500/10"
          >
            <Image className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {disappearTimer}h
            </div>
          </div>

          <Button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showConsentGate && (
        <ConsentGate
          isOpen={showConsentGate}
          onClose={() => setShowConsentGate(false)}
          onConsent={onConsentGranted}
          partnerName={otherUser.name}
        />
      )}

      {showVideoVerify && (
        <VideoVerify
          isOpen={showVideoVerify}
          onClose={() => setShowVideoVerify(false)}
          partnerName={otherUser.name}
          matchId={match.id}
        />
      )}

      {showSafetyTools && (
        <SafetyTools
          isOpen={showSafetyTools}
          onClose={() => setShowSafetyTools(false)}
          matchId={match.id}
          partnerName={otherUser.name}
        />
      )}
    </div>
  );
}
