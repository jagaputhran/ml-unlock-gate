import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { getFlag } from '@/utils/flagUtils';

interface PuzzleRoom3Props {
  onSolved: (flag: string) => void;
  isUnlocked: boolean;
}

const PuzzleRoom3: React.FC<PuzzleRoom3Props> = ({ onSolved, isUnlocked }) => {
  const [dial, setDial] = useState<number[]>([65]);
  const [solved, setSolved] = useState(false);

  const matrix = useMemo(() => ({ TP: 40, TN: 40, FP: 5, FN: 15 }), []);
  const accuracy = useMemo(() => Math.round(((matrix.TP + matrix.TN) / (matrix.TP + matrix.TN + matrix.FP + matrix.FN)) * 100), [matrix]);

  const onChange = (val: number[]) => {
    setDial(val);
    if (!solved && val[0] === accuracy) {
      setSolved(true);
      onSolved(getFlag('accuracy80'));
    }
  };

  return (
    <Card className={`transition-all ${isUnlocked ? 'neon-border' : 'opacity-60 pointer-events-none'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Room 3</Badge>
          Accuracy Code Lock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded border bg-background/60">
            <div className="font-medium mb-2">Confusion Matrix</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-emerald-500/10">TP: {matrix.TP}</div>
              <div className="p-2 rounded bg-emerald-500/10">TN: {matrix.TN}</div>
              <div className="p-2 rounded bg-rose-500/10">FP: {matrix.FP}</div>
              <div className="p-2 rounded bg-rose-500/10">FN: {matrix.FN}</div>
            </div>
          </div>
          <div className="p-3 rounded border bg-background/60">
            <div className="font-medium mb-2">Safe Dial</div>
            <Slider min={50} max={100} step={1} value={dial} onValueChange={onChange} />
            <div className="text-sm text-muted-foreground mt-2">Set to the correct accuracy (%) to unlock.</div>
            <div className="mt-2 text-primary">Dial: {dial[0]}%</div>
          </div>
        </div>
        {solved && (
          <div className="p-3 rounded border bg-ctf-success/10 text-ctf-success">
            🔓 Unlocked! Accuracy = (TP + TN) / Total. Great job!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleRoom3;
