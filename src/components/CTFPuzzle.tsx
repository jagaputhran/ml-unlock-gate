import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, CheckCircle } from 'lucide-react';

interface CTFPuzzleProps {
  id: number;
  title: string;
  emoji: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  flag: string;
  funFact: string;
  isUnlocked: boolean;
  onSolve: (id: number, flag: string) => void;
}

const CTFPuzzle: React.FC<CTFPuzzleProps> = ({
  id,
  title,
  emoji,
  question,
  choices,
  correctAnswer,
  flag,
  funFact,
  isUnlocked,
  onSolve
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setTimeout(() => {
        onSolve(id, flag);
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <Card className={`relative transition-all duration-500 ${
      isUnlocked 
        ? 'neon-border unlock-animation bg-card/80 backdrop-blur-sm' 
        : 'border-ctf-locked/50 bg-muted/20'
    }`}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">{emoji}</span>
          {isUnlocked ? (
            <Unlock className="w-6 h-6 text-ctf-success" />
          ) : (
            <Lock className="w-6 h-6 text-ctf-locked" />
          )}
        </div>
        <CardTitle className={`text-xl ${isUnlocked ? 'text-ctf-primary glitch-text' : 'text-ctf-locked'}`}>
          Section {id} – {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className={`text-lg font-medium ${isUnlocked ? 'text-foreground' : 'text-ctf-locked'}`}>
          {question}
        </p>
        
        {isUnlocked && (
          <>
            <div className="space-y-3">
              {choices.map((choice, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full text-left justify-start h-auto p-4 transition-all duration-300 ${
                    selectedAnswer === index 
                      ? 'neon-glow bg-primary text-primary-foreground' 
                      : 'hover:neon-border'
                  } ${
                    showResult && index === correctAnswer 
                      ? 'bg-ctf-success text-black' 
                      : showResult && selectedAnswer === index && index !== correctAnswer
                      ? 'bg-destructive text-destructive-foreground'
                      : ''
                  }`}
                  onClick={() => !showResult && setSelectedAnswer(index)}
                  disabled={showResult}
                >
                  <span className="font-mono mr-2">{String.fromCharCode(65 + index)}.</span>
                  {choice}
                  {showResult && index === correctAnswer && (
                    <CheckCircle className="w-5 h-5 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
            
            {!showResult && selectedAnswer !== null && (
              <Button 
                onClick={handleSubmit}
                className="w-full pulse-neon bg-primary hover:bg-primary/80"
              >
                Submit Answer
              </Button>
            )}
            
            {showResult && (
              <div className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                isCorrect 
                  ? 'border-ctf-success bg-ctf-success/10 text-ctf-success' 
                  : 'border-destructive bg-destructive/10 text-destructive'
              }`}>
                {isCorrect ? (
                  <div className="space-y-3">
                    <p className="font-bold text-lg">🎉 Correct! Flag Unlocked:</p>
                    <div className="font-mono text-lg bg-black/50 p-3 rounded border border-ctf-success">
                      {flag}
                    </div>
                    <div className="text-sm bg-ctf-success/20 p-3 rounded">
                      <strong>💡 Fun Fact:</strong> {funFact}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="font-bold">❌ Incorrect. Try again!</p>
                    <Button 
                      onClick={handleTryAgain}
                      variant="outline"
                      className="w-full"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {!isUnlocked && (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 text-ctf-locked mx-auto mb-4" />
            <p className="text-ctf-locked">Complete previous sections to unlock</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CTFPuzzle;