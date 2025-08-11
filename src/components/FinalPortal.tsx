import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateCombinedFlags } from '@/utils/flagUtils';
import { PartyPopper, ExternalLink, KeyRound, User } from 'lucide-react';

interface FinalPortalProps {
  alias: string;
  flags: string[];
  isUnlocked: boolean;
  msFormLink?: string;
}

const FinalPortal: React.FC<FinalPortalProps> = ({ alias, flags, isUnlocked, msFormLink }) => {
  const [input, setInput] = useState('');
  const [ok, setOk] = useState(false);

  const onSubmit = () => {
    if (validateCombinedFlags(input)) setOk(true);
  };

  return (
    <Card className={`relative transition-all duration-500 ${isUnlocked ? 'neon-border bg-card/90 backdrop-blur-sm' : 'opacity-60 pointer-events-none'}`}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">🚪</span>
          <KeyRound className={`w-8 h-8 text-ctf-primary`} />
        </div>
        <CardTitle className="text-2xl text-ctf-primary glitch-text">Flag Portal - Quantum Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!ok ? (
          <>
            <div className="text-center space-y-2">
              <p>Combine your 4 flags (order matters) with hyphens.</p>
              <p className="text-sm text-muted-foreground font-mono user-select-none">
                FLAG{'{classifier}'}-FLAG{'{labels}'}-FLAG{'{accuracy80}'}-FLAG{'{not_toast}'}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-ctf-primary">Your Collected Flags</h4>
              <div className="space-y-2 select-none">
                {flags.length === 0 ? (
                  <p className="text-muted-foreground italic">No flags collected yet...</p>
                ) : (
                  flags.map((f, i) => (
                    <div key={i} className="font-mono text-sm bg-black/50 p-2 rounded border border-ctf-success/50 user-select-none">
                      {f}
                    </div>
                  ))
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Progress: {flags.length}/4</p>
            </div>
            <div className="space-y-3">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter combined flags..." className="font-mono" />
              <Button onClick={onSubmit} className="w-full pulse-neon" disabled={!input.trim()}>Unlock Portal</Button>
            </div>
          </>
        ) : (
          <div className="space-y-6 text-center">
            <div className="p-6 rounded-lg border-2 border-ctf-success bg-ctf-success/10 text-ctf-success unlock-animation">
              <PartyPopper className="w-16 h-16 mx-auto mb-4 text-ctf-success" />
              <h3 className="text-2xl font-bold mb-2">Portal Unlocked!</h3>
              <p className="text-lg">Agent: <span className="font-mono">{alias || 'anonymous'}</span></p>
            </div>
            <div className="text-left bg-muted/40 p-4 rounded border">
              <div className="font-semibold mb-2">Screenshot Checklist</div>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Make sure your Alias and all 4 flags are visible</li>
                <li>Take a screenshot now (Cmd/Ctrl + Shift + S)</li>
                <li>Upload it to the Microsoft Form</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <Button asChild className="pulse-neon bg-ctf-success text-black hover:bg-ctf-success/80">
                <a href={msFormLink || 'https://forms.office.com/r/r66dt5HVSC'} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> Open Microsoft Form
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalPortal;
