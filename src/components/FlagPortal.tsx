import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, ExternalLink, PartyPopper } from 'lucide-react';

interface FlagPortalProps {
  collectedFlags: string[];
  isUnlocked: boolean;
}

const FlagPortal: React.FC<FlagPortalProps> = ({ collectedFlags, isUnlocked }) => {
  const [flagInput, setFlagInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const correctCombination = 'FLAG{classifier}-FLAG{labels}-FLAG{accuracy80}-FLAG{not_toast}';
  const msFormLink = 'https://forms.microsoft.com/r/your-form-id'; // Replace with actual form link

  const handleSubmit = () => {
    if (flagInput.trim() === correctCombination) {
      setShowSuccess(true);
      setShowError(false);
    } else {
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const openForm = () => {
    window.open(msFormLink, '_blank');
  };

  return (
    <Card className={`relative transition-all duration-500 ${
      isUnlocked 
        ? 'neon-border bg-card/90 backdrop-blur-sm' 
        : 'border-ctf-locked/50 bg-muted/20'
    }`}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">🚪</span>
          <KeyRound className={`w-8 h-8 ${isUnlocked ? 'text-ctf-primary' : 'text-ctf-locked'}`} />
        </div>
        <CardTitle className={`text-2xl ${isUnlocked ? 'text-ctf-primary glitch-text' : 'text-ctf-locked'}`}>
          Flag Portal - Enter the Learning Portal
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isUnlocked ? (
          <>
            <div className="text-center space-y-4">
              <p className="text-lg">
                🎯 <strong>Final Challenge:</strong> Combine your 4 flags (in order), separated by hyphens.
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                Example: FLAG{'{a}'}-FLAG{'{b}'}-FLAG{'{c}'}-FLAG{'{d}'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-ctf-primary">Collected Flags:</h4>
                <div className="space-y-2">
                  {collectedFlags.length === 0 ? (
                    <p className="text-muted-foreground italic">No flags collected yet...</p>
                  ) : (
                    collectedFlags.map((flag, index) => (
                      <div key={index} className="font-mono text-sm bg-black/50 p-2 rounded border border-ctf-success/50">
                        {flag}
                      </div>
                    ))
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Progress: {collectedFlags.length}/4 flags collected
                </p>
              </div>

              {!showSuccess && (
                <>
                  <Input
                    placeholder="Enter combined flags here..."
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    className="font-mono text-sm"
                  />
                  
                  <Button 
                    onClick={handleSubmit}
                    className="w-full pulse-neon bg-primary hover:bg-primary/80"
                    disabled={!flagInput.trim()}
                  >
                    🔓 Unlock Portal
                  </Button>
                </>
              )}

              {showError && (
                <div className="p-4 rounded-lg border-2 border-destructive bg-destructive/10 text-destructive">
                  ❌ Incorrect combination. Check your flags and try again!
                </div>
              )}

              {showSuccess && (
                <div className="space-y-6 text-center">
                  <div className="p-6 rounded-lg border-2 border-ctf-success bg-ctf-success/10 text-ctf-success unlock-animation">
                    <PartyPopper className="w-16 h-16 mx-auto mb-4 text-ctf-success" />
                    <h3 className="text-2xl font-bold mb-2">🎉 Portal Unlocked!</h3>
                    <p className="text-lg">You've successfully completed the ML CTF Challenge!</p>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-lg font-semibold">
                      Ready to dive deeper into Machine Learning?
                    </p>
                    <Button 
                      onClick={openForm}
                      className="pulse-neon bg-ctf-success text-black hover:bg-ctf-success/80 text-lg p-6 h-auto"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Enroll in ML Learning Session
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Click above to access the Microsoft Form and secure your spot!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <KeyRound className="w-16 h-16 text-ctf-locked mx-auto mb-4" />
            <p className="text-ctf-locked text-lg">Complete all 4 sections to access the portal</p>
            <div className="mt-4 text-sm text-muted-foreground">
              Progress: {collectedFlags.length}/4 sections completed
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlagPortal;