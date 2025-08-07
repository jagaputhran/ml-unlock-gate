import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFlag } from '@/utils/flagUtils';

interface PuzzleRoom2Props {
  onSolved: (flag: string) => void;
  isUnlocked: boolean;
}

const items = [
  {
    id: 'unlabeled',
    title: 'Unlabeled Cloud',
    density: 20,
    labeled: 0.1,
  },
  {
    id: 'partial',
    title: 'Partially Labeled Set',
    density: 40,
    labeled: 0.5,
  },
  {
    id: 'full',
    title: 'Fully Labeled Dataset',
    density: 60,
    labeled: 1,
  },
] as const;

const DotField: React.FC<{ density: number; labeled: number }> = ({ density, labeled }) => {
  const dots = Array.from({ length: density });
  return (
    <div className="relative w-full h-32 overflow-hidden rounded bg-background/60 border">
      {dots.map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const isLabeled = Math.random() < labeled;
        return (
          <div
            key={i}
            className={`absolute rounded-full ${isLabeled ? 'bg-primary' : 'bg-muted-foreground/40'}`}
            style={{ left: `${left}%`, top: `${top}%`, width: 6, height: 6 }}
            title={isLabeled ? 'label' : ''}
          />
        );
      })}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-gradient-to-tr from-transparent via-primary/10 to-transparent" />
    </div>
  );
};

const PuzzleRoom2: React.FC<PuzzleRoom2Props> = ({ onSolved, isUnlocked }) => {
  const [solved, setSolved] = useState(false);

  const choose = (id: string) => {
    if (solved) return;
    if (id === 'full') {
      setSolved(true);
      onSolved(getFlag('labels'));
    }
  };

  return (
    <Card className={`transition-all ${isUnlocked ? 'neon-border' : 'opacity-60 pointer-events-none'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Room 2</Badge>
          Data Vault Decryption
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4">
        {items.map((it) => (
          <button
            key={it.id}
            className="text-left space-y-2 group"
            onClick={() => choose(it.id)}
          >
            <DotField density={it.density} labeled={it.labeled} />
            <div className="font-medium group-hover:text-primary transition-colors">{it.title}</div>
            <div className="text-xs text-muted-foreground">Hover to inspect labels</div>
          </button>
        ))}
        {solved && (
          <div className="md:col-span-3 p-3 rounded border bg-ctf-success/10 text-ctf-success">
            ✅ Nice! Fully labeled data powers supervised learning.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleRoom2;
