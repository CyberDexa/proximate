'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Trophy, AlertTriangle } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'consent-withdrawal',
    question: "During an intimate encounter, your partner says 'wait, I'm not sure about this.' What should you do?",
    options: [
      "Continue slowly to help them feel more comfortable",
      "Ask them what specifically they're unsure about and keep going",
      "Immediately stop and check in with them about how they're feeling",
      "Suggest trying something different instead"
    ],
    correctAnswer: 2,
    explanation: "Consent can be withdrawn at any time. When someone expresses uncertainty, the only appropriate response is to stop immediately and have an open conversation about their comfort level."
  },
  {
    id: 'intoxication-consent',
    question: "You're at a party and someone who's had several drinks is being very flirtatious with you. They invite you back to their place. What should you do?",
    options: [
      "Go with them since they're being clear about what they want",
      "Ask them how much they've had to drink first",
      "Wait until they're sober to pursue anything physical",
      "Make sure they really want to by asking multiple times"
    ],
    correctAnswer: 2,
    explanation: "Someone who is intoxicated cannot give meaningful consent. The responsible thing to do is wait until they are sober and can make a clear-headed decision."
  },
  {
    id: 'pressure-scenario',
    question: "You've been talking to someone for weeks and they keep saying they're 'not ready' for certain activities. What's the best approach?",
    options: [
      "Keep asking occasionally until they change their mind",
      "Explain how much it would mean to you",
      "Respect their boundary and let them bring it up if/when they're ready",
      "Suggest starting with something smaller first"
    ],
    correctAnswer: 2,
    explanation: "Respecting boundaries means accepting 'not ready' without pressure. Repeatedly asking or trying to convince someone violates their clearly stated boundary."
  },
  {
    id: 'non-verbal-cues',
    question: "During an encounter, you notice your partner has become quiet and seems tense, but they haven't said anything. What should you do?",
    options: [
      "Continue since they haven't said to stop",
      "Ask if they're okay and check in about their comfort level",
      "Try to make them more comfortable by being more gentle",
      "Finish quickly so they don't have to endure it longer"
    ],
    correctAnswer: 1,
    explanation: "Changes in body language or behavior are important cues. Good communication means checking in when you notice these changes, not assuming silence means consent."
  },
  {
    id: 'ongoing-consent',
    question: "You and someone have been intimate before. Tonight, they seem interested but less enthusiastic than usual. What should you consider?",
    options: [
      "They've consented before, so it's fine to proceed",
      "Past consent means ongoing consent in relationships",
      "Each encounter requires fresh, enthusiastic consent",
      "You know them well enough to read their signals"
    ],
    correctAnswer: 2,
    explanation: "Consent is not a one-time agreement. Each encounter requires fresh consent, and past intimacy doesn't guarantee ongoing consent for future activities."
  }
];

interface ConsentQuizProps {
  onPass: () => void;
  onRetry: () => void;
  progress: number;
}

export default function ConsentQuiz({ onPass, onRetry, progress }: ConsentQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const passThreshold = 4; // Must get 4/5 correct
  const hasPassed = score >= passThreshold;

  if (showResults) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Consent Education Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                hasPassed ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                {hasPassed ? (
                  <Trophy className="w-10 h-10 text-green-500" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                )}
              </div>
              
              <CardTitle className="text-2xl">
                {hasPassed ? 'Congratulations!' : 'Quiz Not Passed'}
              </CardTitle>
              
              <p className="text-muted-foreground">
                You scored {score} out of {quizQuestions.length} questions correctly.
                {hasPassed 
                  ? ' You can proceed to the next step.'
                  : ` You need ${passThreshold} correct answers to pass.`
                }
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Detailed Results */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Review Your Answers</h3>
                
                {quizQuestions.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mt-1" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">Question {index + 1}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {question.question}
                          </p>
                          
                          {!isCorrect && (
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="text-red-500">Your answer:</span>{' '}
                                {question.options[userAnswer]}
                              </p>
                              <p className="text-sm">
                                <span className="text-green-500">Correct answer:</span>{' '}
                                {question.options[question.correctAnswer]}
                              </p>
                              <p className="text-sm text-muted-foreground bg-muted p-2 rounded border-l-4 border-blue-500">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                {!hasPassed ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={onRetry}
                      className="flex-1"
                    >
                      Review Education Materials
                    </Button>
                    <Button
                      onClick={resetQuiz}
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake Quiz
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={onPass}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Continue to Agreement
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const canProceed = selectedAnswer !== undefined;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Consent Education Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Quiz Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Consent Knowledge Quiz</h1>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {quizQuestions.length} • 
            You need {passThreshold} correct answers to pass
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Answer Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    selectedAnswer === index
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-muted hover:border-muted-foreground/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      selectedAnswer === index
                        ? 'border-primary bg-primary text-white'
                        : 'border-muted-foreground'
                    }`}>
                      <span className="text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="min-w-32"
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Info */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4" />
              <span>
                This quiz tests your understanding of consent, boundaries, and respectful behavior.
                Take your time and choose the most appropriate response for each scenario.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
