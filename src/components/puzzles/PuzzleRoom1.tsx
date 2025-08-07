import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getFlag } from '@/utils/flagUtils';
import { Brain, Boxes, Ratio, Gamepad2 } from 'lucide-react';

interface PuzzleRoom1Props {
  onSolved: (flag: string) => void;
  isUnlocked: boolean;
}

const targets = [
  { id: 'classification', label: 'Classification', Icon: Brain },
  { id: 'regression', label: 'Regression', Icon: Ratio },
  { id: 'clustering', label: 'Clustering', Icon: Boxes },
  { id: 'reinforcement', label: 'Reinforcement', Icon: Gamepad2 },
] as const;

const datasets = [
  { id: 'spam', label: 'Spam detection (emails)' },
  { id: 'prices', label: 'House prices' },
  { id: 'segments', label: 'Customer segments' },
  { id: 'robot', label: 'Robot navigation' },
] as const;

const PuzzleRoom1: React.FC<PuzzleRoom1Props> = ({ onSolved, isUnlocked }) => {
  const [placed, setPlaced] = useState<Record<string, string | null>>({
    classification: null,
    regression: null,
    clustering: null,
    reinforcement: null,
  });
  const [solved, setSolved] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const dataId = e.dataTransfer.getData('text/plain');
    setPlaced((prev) => ({ ...prev, [targetId]: dataId }));
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const check = () => {
    const ok = placed.classification === 'spam';
    if (ok) {
      const flag = getFlag('classifier');
      setSolved(true);
      onSolved(flag);
    }
  };

  return (
    <Card className={`transition-all ${isUnlocked ? 'neon-border' : 'opacity-60 pointer-events-none'} `}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Room 1</Badge>
          Classifier Decoder Lab
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p>Drag a dataset onto the correct ML gate.</p>
          <div className="grid grid-cols-2 gap-3">
            {datasets.map((d) => (
              <div
                key={d.id}
                draggable={!solved}
                onDragStart={(e) => handleDragStart(e, d.id)}
                className="p-3 rounded border bg-background/60 hover:bg-background/80 cursor-move hover-scale"
              >
                {d.label}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {targets.map(({ id, label, Icon }) => (
            <div
              key={id}
              onDrop={(e) => handleDrop(e, id)}
              onDragOver={allowDrop}
              className="relative p-4 rounded-lg border-2 border-dashed bg-muted/30 min-h-[92px] flex items-center justify-center text-center"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-4 h-4" /> {label}
              </div>
              {placed[id] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="px-2 py-1 rounded bg-primary/10 text-primary text-sm">
                    {datasets.find((d) => d.id === placed[id])?.label}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="md:col-span-2 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hint: Spam → Classification
          </div>
          <Button onClick={check} disabled={solved} className="pulse-neon">
            Validate
          </Button>
        </div>
        {solved && (
          <div className="md:col-span-2 p-3 rounded border bg-ctf-success/10 text-ctf-success">
            ✅ Correct! Flag revealed. Fun fact: Classification assigns labels to inputs.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleRoom1;
