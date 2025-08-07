import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, Thermometer, Tv, Sandwich } from 'lucide-react';
import { getFlag } from '@/utils/flagUtils';

interface PuzzleRoom4Props {
  onSolved: (flag: string) => void;
  isUnlocked: boolean;
}

const gadgets = [
  { id: 'thermostat', label: 'Smart Thermostat', Icon: Thermometer, ml: true },
  { id: 'netflix', label: 'Streaming Recommender', Icon: Tv, ml: true },
  { id: 'camera', label: 'Security Camera', Icon: Camera, ml: true },
  { id: 'toaster', label: 'Toaster', Icon: Sandwich, ml: false },
] as const;

const PuzzleRoom4: React.FC<PuzzleRoom4Props> = ({ onSolved, isUnlocked }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const check = () => {
    const has3 = ['thermostat', 'netflix', 'camera'].every((x) => selected.includes(x));
    const notToaster = !selected.includes('toaster');
    if (has3 && notToaster) {
      setSolved(true);
      onSolved(getFlag('not_toast'));
    }
  };

  return (
    <Card className={`transition-all ${isUnlocked ? 'neon-border' : 'opacity-60 pointer-events-none'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Room 4</Badge>
          Mission: ML or Not?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-4 gap-3">
          {gadgets.map(({ id, label, Icon }) => {
            const active = selected.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className={`p-4 rounded-lg border text-left transition-all ${active ? 'bg-primary/10 border-primary' : 'bg-background/60 hover:bg-background/80'}`}
              >
                <Icon className={`w-6 h-6 mb-2 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="font-medium">{label}</div>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end">
          <Button className="pulse-neon" onClick={check} disabled={solved}>
            Confirm Selection
          </Button>
        </div>
        {solved && (
          <div className="p-3 rounded border bg-ctf-success/10 text-ctf-success">
            ✅ Correct! Everyday ML is closer than you think.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleRoom4;
