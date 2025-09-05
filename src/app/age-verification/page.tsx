'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Calendar, Shield, X } from 'lucide-react';
import { 
  verifyAge, 
  storeAgeVerification, 
  formatAgeVerificationErrors 
} from '@/lib/age-verification';

export default function AgeVerificationPage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      if (!birthDate) {
        setErrors(['Please enter your date of birth']);
        return;
      }

      const date = new Date(birthDate);
      const verification = verifyAge(date);

      if (!verification.isValid) {
        setErrors(verification.errors);
        return;
      }

      // Store verification and proceed
      storeAgeVerification(date);
      
      // Log verification attempt (in production, send to API)
      console.log('Age verification successful:', {
        age: verification.age,
        timestamp: new Date().toISOString()
      });

      // Redirect to mandatory ID verification
      router.push('/id-verification');
      
    } catch (error) {
      setErrors(['Invalid date format. Please use MM/DD/YYYY']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    // In production, redirect to a "goodbye" page or close the app
    window.location.href = 'https://google.com';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-destructive/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-foreground">
            Adults Only (18+)
          </CardTitle>
          
          <div className="text-muted-foreground space-y-2">
            <p>
              This app is exclusively for adults seeking casual connections. 
              You must be 18 or older to continue.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Shield className="w-4 h-4" />
              <span>Privacy protected • Age verified</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="birthDate" className="text-sm font-medium text-foreground">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value)}
                  className="pl-10"
                  placeholder="MM/DD/YYYY"
                  min={new Date(new Date().getFullYear() - 100, 0, 1).toISOString().split('T')[0]}
                  max={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {errors.length > 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-destructive">
                    {formatAgeVerificationErrors(errors)}
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify Age →'}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="border-t border-border"></div>
            
            <Button 
              variant="outline" 
              onClick={handleExit}
              className="w-full border-muted-foreground/20 hover:bg-muted/10"
            >
              <X className="w-4 h-4 mr-2" />
              Exit
            </Button>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>By continuing, you confirm that:</p>
              <ul className="list-disc list-inside text-left space-y-1 mt-2">
                <li>You are at least 18 years old</li>
                <li>You understand this app contains adult content</li>
                <li>You are legally able to view such content in your location</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
