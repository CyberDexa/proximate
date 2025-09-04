'use client';

import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, X, Clock, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VideoVerifyProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  matchId: string;
}

export function VideoVerify({ isOpen, onClose, partnerName, matchId }: VideoVerifyProps) {
  const [step, setStep] = useState<'intro' | 'calling' | 'active' | 'complete'>('intro');
  const [timeLeft, setTimeLeft] = useState(30); // 30 second limit
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [backgroundBlurred, setBackgroundBlurred] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Timer for 30-second limit
  useEffect(() => {
    if (step === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && step === 'active') {
      handleCallEnd();
    }
  }, [step, timeLeft]);

  const startCall = async () => {
    try {
      setStep('calling');
      // TODO: Initialize WebRTC connection
      
      // Mock call connection
      setTimeout(() => {
        setStep('active');
        setCallStarted(true);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to start video call:', error);
    }
  };

  const handleCallEnd = () => {
    setStep('complete');
    // TODO: Clean up WebRTC connections
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    // TODO: Enable/disable video stream
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    // TODO: Enable/disable audio stream
  };

  const toggleBackgroundBlur = () => {
    setBackgroundBlurred(!backgroundBlurred);
    // TODO: Apply/remove background blur filter
  };

  if (!isOpen) return null;

  const renderIntroStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Video className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Video Verification
        </h3>
        <p className="text-muted-foreground">
          {partnerName} wants to video verify before meeting. This helps ensure safety and builds trust.
        </p>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-emerald-600">
            <p className="font-medium mb-1">Safety Features:</p>
            <ul className="space-y-1 text-xs">
              <li>• 30-second time limit</li>
              <li>• No recording allowed</li>
              <li>• Background blur mandatory</li>
              <li>• Camera and audio required</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Video className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Camera</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleVideo}
            className={videoEnabled ? 'text-emerald-500' : 'text-red-500'}
          >
            {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Mic className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Microphone</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleAudio}
            className={audioEnabled ? 'text-emerald-500' : 'text-red-500'}
          >
            {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Background Blur</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleBackgroundBlur}
            className={backgroundBlurred ? 'text-emerald-500' : 'text-orange-500'}
          >
            {backgroundBlurred ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={startCall}
          disabled={!videoEnabled || !audioEnabled || !backgroundBlurred}
          className="flex-1 bg-blue-500 hover:bg-blue-600"
        >
          <Video className="h-4 w-4 mr-2" />
          Start Call
        </Button>
      </div>
    </div>
  );

  const renderCallingStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
          <Video className="h-10 w-10 text-blue-500" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Calling {partnerName}...
        </h3>
        <p className="text-muted-foreground">
          Waiting for them to join the video call
        </p>
      </div>

      <div className="space-y-3">
        <div className="animate-pulse">
          <div className="h-2 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onClose}
        className="text-red-500 border-red-500/20 hover:bg-red-500/10"
      >
        <X className="h-4 w-4 mr-2" />
        Cancel Call
      </Button>
    </div>
  );

  const renderActiveStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Video Call Active</span>
        </div>
        <Badge variant="secondary" className="bg-red-500/20 text-red-400">
          <Clock className="h-3 w-3 mr-1" />
          {timeLeft}s
        </Badge>
      </div>

      {/* Video Container */}
      <div className="relative bg-card border border-border rounded-lg overflow-hidden h-64">
        {/* Remote Video (Partner) */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        
        {/* Local Video (Self) - Picture in Picture */}
        <div className="absolute top-4 right-4 w-20 h-28 bg-gray-800 rounded-lg overflow-hidden border border-border">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            style={{
              filter: backgroundBlurred ? 'blur(5px) brightness(0.8)' : 'none'
            }}
          />
          {!videoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            onClick={toggleAudio}
            className={`${audioEnabled ? 'bg-card' : 'bg-red-500 text-white'} border-white/20`}
          >
            {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>

          <Button
            size="sm"
            onClick={handleCallEnd}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <X className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={toggleVideo}
            className={`${videoEnabled ? 'bg-card' : 'bg-red-500 text-white'} border-white/20`}
          >
            {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        This call is not recorded and will end automatically in {timeLeft} seconds
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Shield className="h-8 w-8 text-emerald-500" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Video Verification Complete
        </h3>
        <p className="text-muted-foreground">
          You've successfully video verified with {partnerName}. This adds a "Video Verified" badge to your conversation.
        </p>
      </div>

      <Badge className="bg-emerald-500/20 text-emerald-400">
        ✓ Video Verified
      </Badge>

      <Button
        onClick={onClose}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Continue Messaging
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-background border border-border">
        <div className="p-6">
          {step === 'intro' && renderIntroStep()}
          {step === 'calling' && renderCallingStep()}
          {step === 'active' && renderActiveStep()}
          {step === 'complete' && renderCompleteStep()}
        </div>
      </Card>
    </div>
  );
}
