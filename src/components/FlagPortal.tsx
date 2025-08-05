import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { KeyRound, ExternalLink, PartyPopper, User, Mail } from 'lucide-react';
import { supabase, isSupabaseConnected, type CTFCompletion } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface FlagPortalProps {
  collectedFlags: string[];
  isUnlocked: boolean;
  startTime: number;
}

const FlagPortal: React.FC<FlagPortalProps> = ({ collectedFlags, isUnlocked, startTime }) => {
  const [flagInput, setFlagInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const correctCombinations = [
    'FLAG{neural_maze}-FLAG{overfit_trap}-FLAG{forest_power}-FLAG{feature_master}',
    'neural_maze-overfit_trap-forest_power-feature_master',
    'FLAG{neural_maze} FLAG{overfit_trap} FLAG{forest_power} FLAG{feature_master}',
    'neural_maze overfit_trap forest_power feature_master'
  ];
  const msFormLink = 'https://forms.microsoft.com/r/your-form-id'; // Replace with actual form link

  const handleSubmit = () => {
    const userInput = flagInput.trim().toLowerCase();
    const isCorrect = correctCombinations.some(combo => 
      combo.toLowerCase() === userInput
    );
    
    if (isCorrect) {
      setShowSuccess(true);
      setShowError(false);
      setShowUserForm(true);
    } else {
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleUserSubmit = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both name and email.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isSupabaseConnected) {
        // If Supabase is not connected, just show success message
        toast({
          title: "Registration Complete! 🎉",
          description: "You've completed the challenge! Connect Supabase to save your progress.",
        });
        setShowUserForm(false);
        return;
      }

      const completionTime = Math.floor((Date.now() - startTime) / 1000);
      
      const { error } = await supabase!
        .from('ctf_completions')
        .insert({
          user_name: userName.trim(),
          email: userEmail.trim(),
          completed_at: new Date().toISOString(),
          flags_collected: collectedFlags,
          completion_time_seconds: completionTime
        });

      if (error) throw error;

      toast({
        title: "Success! 🎉",
        description: "You've been registered for the ML session!",
      });
      
      setShowUserForm(false);
    } catch (error) {
      console.error('Error saving completion:', error);
      toast({
        title: "Error",
        description: "Failed to save your completion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
                Example: FLAG{'{a}'}-FLAG{'{b}'}-FLAG{'{c}'}-FLAG{'{d}'} or just: a-b-c-d
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

              {showSuccess && !showUserForm && (
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
                    <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
                      <DialogTrigger asChild>
                        <Button 
                          className="pulse-neon bg-ctf-success text-black hover:bg-ctf-success/80 text-lg p-6 h-auto"
                        >
                          <User className="w-5 h-5 mr-2" />
                          Register for ML Learning Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-center text-ctf-primary">
                            🎯 Register for ML Session
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="name"
                                placeholder="Enter your full name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          <Button 
                            onClick={handleUserSubmit}
                            disabled={isSubmitting}
                            className="w-full pulse-neon bg-ctf-success text-black hover:bg-ctf-success/80"
                          >
                            {isSubmitting ? (
                              "Registering..."
                            ) : (
                              <>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Complete Registration
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <p className="text-sm text-muted-foreground">
                      Register to secure your spot in the ML learning session!
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