"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PanicButton } from '@/components/safety/panic-button';
import { FakeCall } from '@/components/safety/fake-call';
import { SafeWord } from '@/components/safety/safe-word';
import { TrustScore } from '@/components/safety/trust-score';
import { ReportUser } from '@/components/safety/report-user';
import {
  Shield,
  AlertTriangle,
  Phone,
  MapPin,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
} from 'lucide-react';

interface SafetyFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  lastUsed?: Date;
  icon: React.ReactNode;
}

interface SafetyStats {
  trustScore: number;
  verificationLevel: string;
  emergencyContacts: number;
  recentIncidents: number;
  lastSafetyCheck: Date;
}

export default function SafetyCenterPage() {
  const [safetyStats, setSafetyStats] = useState<SafetyStats>({
    trustScore: 0,
    verificationLevel: 'basic',
    emergencyContacts: 0,
    recentIncidents: 0,
    lastSafetyCheck: new Date(),
  });

  const [activeFeatures, setActiveFeatures] = useState<SafetyFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSafetyData();
  }, []);

  const loadSafetyData = async () => {
    try {
      setLoading(true);
      
      // Load safety statistics
      const statsResponse = await fetch('/api/safety/stats');
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setSafetyStats(stats);
      }

      // Load active safety features
      const featuresResponse = await fetch('/api/safety/features');
      if (featuresResponse.ok) {
        const features = await featuresResponse.json();
        setActiveFeatures(features);
      }
    } catch (error) {
      console.error('Failed to load safety data:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultFeatures: SafetyFeature[] = [
    {
      id: 'panic_button',
      name: 'Panic Button',
      description: 'Emergency alert system',
      enabled: true,
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      id: 'safe_word',
      name: 'Safe Word',
      description: 'Instant emergency protocol',
      enabled: false,
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      id: 'location_sharing',
      name: 'Location Sharing',
      description: 'Share location with trusted contacts',
      enabled: false,
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      id: 'emergency_contacts',
      name: 'Emergency Contacts',
      description: 'People who will be notified in emergencies',
      enabled: safetyStats.emergencyContacts > 0,
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: 'auto_check_in',
      name: 'Auto Check-in',
      description: 'Automatic safety check during meetups',
      enabled: true,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: 'incognito_mode',
      name: 'Incognito Mode',
      description: 'Browse privately without being seen',
      enabled: false,
      icon: <Eye className="h-5 w-5" />,
    },
  ];

  const features = activeFeatures.length > 0 ? activeFeatures : defaultFeatures;

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-green-500" />
          Safety Center
        </h1>
        <p className="text-muted-foreground">
          Your safety is our priority. Manage all your safety features here.
        </p>
      </div>

      {/* Trust Score & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trust Score</p>
              <p className="text-2xl font-bold text-green-500">
                {safetyStats.trustScore}/100
              </p>
            </div>
            <TrustScore score={safetyStats.trustScore} className="h-12 w-12" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verification</p>
              <Badge variant={safetyStats.verificationLevel === 'verified' ? 'default' : 'secondary'}>
                {safetyStats.verificationLevel}
              </Badge>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Emergency Contacts</p>
              <p className="text-2xl font-bold">{safetyStats.emergencyContacts}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recent Incidents</p>
              <p className="text-2xl font-bold">{safetyStats.recentIncidents}</p>
            </div>
            {safetyStats.recentIncidents === 0 ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
          </div>
        </Card>
      </div>

      {/* Emergency Tools */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Emergency Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center space-y-4">
            <h3 className="font-medium">Panic Button</h3>
            <p className="text-sm text-muted-foreground">
              Hold for 3 seconds to send emergency alert
            </p>
            <PanicButton size="lg" />
          </Card>

          <Card className="p-6 text-center space-y-4">
            <h3 className="font-medium">Fake Call</h3>
            <p className="text-sm text-muted-foreground">
              Generate realistic incoming call to exit situations
            </p>
            <FakeCall triggerVariant="emergency" />
          </Card>

          <Card className="p-6 text-center space-y-4">
            <h3 className="font-medium">Report Issue</h3>
            <p className="text-sm text-muted-foreground">
              Report inappropriate behavior or safety concerns
            </p>
            <ReportUser />
          </Card>
        </div>
      </div>

      {/* Safety Features */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Safety Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    {feature.lastUsed && (
                      <p className="text-xs text-muted-foreground">
                        Last used: {feature.lastUsed.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={feature.enabled ? 'default' : 'secondary'}>
                    {feature.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {feature.enabled ? 'Configure' : 'Enable'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Safe Word Setup */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Safe Word Protection</h2>
        <Card className="p-6">
          <SafeWord />
        </Card>
      </div>

      {/* Educational Resources */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Safety Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium">Consent Guidelines</h3>
                <p className="text-sm text-muted-foreground">
                  Understanding enthusiastic consent and healthy boundaries
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-medium">Safe Meetup Tips</h3>
                <p className="text-sm text-muted-foreground">
                  Best practices for meeting new people safely
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <h3 className="font-medium">Emergency Resources</h3>
                <p className="text-sm text-muted-foreground">
                  Crisis hotlines and local support resources
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-muted p-6 rounded-lg">
        <h3 className="font-medium mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Add Emergency Contact
          </Button>
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Complete Verification
          </Button>
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            Set Location Sharing
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Test Safety Features
          </Button>
        </div>
      </div>
    </div>
  );
}
