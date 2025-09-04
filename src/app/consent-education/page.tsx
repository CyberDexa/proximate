'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Heart, Shield, Users, ArrowRight, BookOpen } from 'lucide-react';
import ConsentQuiz from '@/components/consent/consent-quiz';
import ConsentAgreement from '@/components/consent/consent-agreement';

interface ConsentTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
  keyPoints: string[];
}

const consentTopics: ConsentTopic[] = [
  {
    id: 'enthusiastic-consent',
    title: 'Enthusiastic Consent',
    icon: <Heart className="w-6 h-6" />,
    content: [
      "Consent is an ongoing, enthusiastic agreement to participate in sexual activity.",
      "It's not just the absence of 'no' - it's an active, clear 'yes' throughout the entire encounter.",
      "Consent can be given verbally or through clear, unambiguous actions."
    ],
    keyPoints: [
      "Must be freely given without pressure or coercion",
      "Can be withdrawn at any time, for any reason",
      "Required for each new sexual act or escalation",
      "Cannot be given if someone is intoxicated or incapacitated"
    ]
  },
  {
    id: 'boundaries',
    title: 'Boundaries & Communication',
    icon: <Shield className="w-6 h-6" />,
    content: [
      "Healthy sexual encounters require clear communication about boundaries and preferences.",
      "Everyone has the right to set limits about what they are and aren't comfortable with.",
      "Respecting boundaries builds trust and ensures everyone feels safe and valued."
    ],
    keyPoints: [
      "Discuss boundaries before physical intimacy",
      "Check in regularly during encounters",
      "Respect 'no' immediately without argument or pressure",
      "It's okay to ask questions and clarify comfort levels"
    ]
  },
  {
    id: 'safety-respect',
    title: 'Safety & Respect',
    icon: <Users className="w-6 h-6" />,
    content: [
      "Safe, consensual encounters prioritize everyone's physical and emotional wellbeing.",
      "Respect means treating your partner as a whole person with feelings, not just a sexual object.",
      "Creating a safe environment allows everyone to be present and enjoy the experience."
    ],
    keyPoints: [
      "Practice safe sex - use protection and get tested regularly",
      "Be honest about STI status and recent testing",
      "Create a judgment-free environment",
      "After-care and check-ins show respect for your partner"
    ]
  }
];

export default function ConsentEducationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const progress = ((completedTopics.length + (quizPassed ? 1 : 0)) / (consentTopics.length + 1)) * 100;

  const handleTopicComplete = (topicId: string) => {
    if (!completedTopics.includes(topicId)) {
      setCompletedTopics([...completedTopics, topicId]);
    }
    
    if (currentStep < consentTopics.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handleQuizPass = () => {
    setQuizPassed(true);
    setShowAgreement(true);
  };

  const handleAgreementComplete = async () => {
    try {
      // Store consent education completion
      const response = await fetch('/api/consent/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'education_completion',
          userId: 'anonymous', // Would be actual user ID in production
          topicsCompleted: completedTopics,
          quizScore: 5, // Assuming perfect score since quiz was passed
          quizPassed: true,
          agreementSigned: true
        })
      });

      if (response.ok) {
        // Redirect to main app (for now, until profile setup is created)
        router.push('/discover');
      } else {
        console.error('Failed to save consent confirmation');
      }
    } catch (error) {
      console.error('Error saving consent confirmation:', error);
    }
  };

  if (showAgreement) {
    return (
      <ConsentAgreement 
        onComplete={handleAgreementComplete}
        progress={progress}
      />
    );
  }

  if (showQuiz) {
    return (
      <ConsentQuiz 
        onPass={handleQuizPass}
        onRetry={() => setShowQuiz(false)}
        progress={progress}
      />
    );
  }

  const currentTopic = consentTopics[currentStep];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Consent Education</h1>
          <p className="text-muted-foreground">
            Understanding consent is essential for safe, respectful encounters
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Topic Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {consentTopics.map((topic, index) => (
              <div key={topic.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    completedTopics.includes(topic.id)
                      ? 'bg-green-500 border-green-500 text-white'
                      : index === currentStep
                      ? 'bg-primary border-primary text-white'
                      : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                  }`}
                >
                  {completedTopics.includes(topic.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < consentTopics.length - 1 && (
                  <div className="w-8 h-0.5 bg-muted-foreground/20 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Topic */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {currentTopic.icon}
              </div>
              <CardTitle className="text-2xl">{currentTopic.title}</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Main Content */}
            <div className="space-y-4">
              {currentTopic.content.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Points */}
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-foreground">Key Points:</h3>
              <ul className="space-y-3">
                {currentTopic.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={() => handleTopicComplete(currentTopic.id)}
                className="min-w-32"
              >
                {currentStep === consentTopics.length - 1 ? 'Take Quiz' : 'Next Topic'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Crisis Support</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• National Sexual Assault Hotline: 1-800-656-4673</li>
                  <li>• Crisis Text Line: Text HOME to 741741</li>
                  <li>• LGBT National Hotline: 1-888-843-4564</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Educational Resources</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Planned Parenthood: plannedparenthood.org</li>
                  <li>• RAINN: rainn.org</li>
                  <li>• Consent Education: consent.org</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
