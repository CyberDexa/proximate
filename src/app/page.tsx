'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isAgeVerificationStored } from '@/lib/age-verification';
import { 
  Heart, 
  Shield, 
  MapPin, 
  MessageCircle, 
  Users, 
  CheckCircle,
  ArrowRight,
  Star,
  Lock
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if age verification is stored
    const checkVerification = async () => {
      setIsLoading(false);
      if (isAgeVerificationStored()) {
        // If verified, redirect to main app
        router.push('/discover');
      }
    };
    
    checkVerification();
  }, [router]);

  const handleGetStarted = () => {
    router.push('/age-verification');
  };

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">ProxiMeet</span>
          </div>
          <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
            18+ Only
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Consensual Connections
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Meet like-minded adults for genuine connections. Safety-first platform designed for consensual adult encounters.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              <Shield className="w-3 h-3 mr-1" />
              Safety First
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
              <Lock className="w-3 h-3 mr-1" />
              Privacy Protected
            </Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified Members
            </Badge>
          </div>

          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-sm text-muted-foreground">
            By continuing, you confirm you are 18+ and agree to our terms
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
          <Card className="bg-card/50 border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">Safety First</h3>
              <p className="text-muted-foreground">
                Built-in safety features including emergency contacts, location sharing, and consent verification.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-blue-500/20 hover:border-blue-500/40 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">Local Connections</h3>
              <p className="text-muted-foreground">
                Meet people nearby with smart location-based matching and safe public meetup suggestions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold">Secure Messaging</h3>
              <p className="text-muted-foreground">
                Private messaging with built-in safety tools and consent gates for meaningful conversations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-amber-500/20 hover:border-amber-500/40 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold">Identity Verification</h3>
              <p className="text-muted-foreground">
                Photo and ID verification system to ensure authentic profiles and safer connections.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-pink-500/20 hover:border-pink-500/40 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold">Intention Matching</h3>
              <p className="text-muted-foreground">
                Clear intentions and boundaries to match with people seeking similar experiences.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-indigo-500/20 hover:border-indigo-500/40 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold">Privacy Control</h3>
              <p className="text-muted-foreground">
                Discreet mode, photo protection, and complete control over your privacy and visibility.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Safety Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">Zero</div>
              <div className="text-sm text-muted-foreground">Tolerance</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Meet?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join thousands of verified members in safe, consensual connections.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>© 2025 ProxiMeet. Adult content for 18+ only.</div>
          <div className="flex items-center gap-4">
            <span>Safety</span>
            <span>•</span>
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
