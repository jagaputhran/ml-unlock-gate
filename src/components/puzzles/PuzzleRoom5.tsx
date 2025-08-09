import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface PuzzleRoom5Props {
  isUnlocked: boolean;
  onSolved?: () => void;
}

// Simple Caesar cipher helper
function caesarShift(text: string, shift: number) {
  const a = 'A'.charCodeAt(0);
  const z = 'Z'.charCodeAt(0);
  const A = a; // uppercase only for this puzzle
  return text
    .toUpperCase()
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= A && code <= z) {
        const offset = ((code - A - (shift % 26) + 26) % 26) + A; // decode by shifting backward
        return String.fromCharCode(offset);
      }
      return ch;
    })
    .join('');
}

const ENCRYPTED = 'IJKJSIYMJHNYD';
const SHIFT_HINT = 10; // default slider position
const EXPECTED = 'DEFENDTHECITY';

// Tiny WebAudio SFX
function useSfx() {
  // Sound effects disabled per user request
  return {
    click: () => {},
    success: () => {},
    error: () => {},
    stopAlarm: () => {},
  };
}

const PuzzleRoom5: React.FC<PuzzleRoom5Props> = ({ isUnlocked, onSolved }) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [active, setActive] = useState(false);

  // Cipher state
  const [shift, setShift] = useState(SHIFT_HINT);
  const preview = useMemo(() => caesarShift(ENCRYPTED, shift), [shift]);
  const [cipherSolved, setCipherSolved] = useState(false);

  // Code injection hunt
  const [injectionSolved, setInjectionSolved] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { click, success, error, stopAlarm } = useSfx();

  useEffect(() => {
    if (!isUnlocked) return;
    setActive(true);
    setTimeLeft(90);
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [isUnlocked]);

  useEffect(() => {
    if (!active) return;
    if (timeLeft === 0) {
      setFeedback('⛔ Alarm! Time expired. Threat escalating.');
      // alarm disabled
      setActive(false);
    }
  }, [timeLeft, active]);

  useEffect(() => {
    if (cipherSolved && injectionSolved) {
      setFeedback('✅ Breach contained. Protocol secured.');
      stopAlarm();
      success();
      onSolved?.();
    }
  }, [cipherSolved, injectionSolved, onSolved, success]);


  const handleAcceptDecryption = () => {
    click();
    if (preview === EXPECTED) {
      setCipherSolved(true);
      setFeedback('Cipher cracked. Proceed to code audit.');
      success();
    } else {
      setFeedback('Not quite. Listen to the rumor — shift 5.');
      error();
    }
  };

  const codeLines = [
    "// AI-generated helper utilities",
    "function sanitize(input) {",
    "  // TODO: implement proper escaping",
    "  return input; // currently no-op",
    "}",
    "",
    "export function renderTemplate(template, data) {",
    "  const merged = template.replace(/\\$\\{(\\w+)\\}/g, (_, k) => data[k] ?? '');",
    "  return eval('`' + merged + '`'); ",
    "}",
  ];

  const vulnerableIndex = 8; // the eval(...) line (0-based)

  const onCodeClick = (idx: number) => {
    click();
    if (!cipherSolved) {
      setFeedback('Decrypt first. The console is still encrypted.');
      error();
      return;
    }
    if (idx === vulnerableIndex) {
      setInjectionSolved(true);
      setFeedback('Injection vector identified: dynamic eval on templates.');
      stopAlarm();
      success();
    } else {
      setFeedback('Nope. Trace data flow and find the sink.');
      error();
    }
  };

  return (
    <Card className={`transition-all ${isUnlocked ? 'neon-border' : 'opacity-60 pointer-events-none'} bg-card/80 backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Room 5</Badge>
          Cipher + Code Threat Lab
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Time left</div>
          <div className="text-sm font-mono tabular-nums">{timeLeft}s</div>
          <div className="flex-1">
            <Progress value={(timeLeft / 90) * 100} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Cipher Panel */}
          <section className={`p-4 rounded-md border ${cipherSolved ? 'bg-ctf-success/10' : 'bg-muted/40'}`}>
            <h3 className="text-sm font-semibold mb-2">Cipher Breaker</h3>
            <p className="text-xs text-muted-foreground mb-3">Encrypted Message:</p>
            <div className="font-mono text-lg tracking-wider select-all">{ENCRYPTED}</div>
            <p className="text-xs text-muted-foreground mt-2">Hint: Try a Caesar shift. The key equals the edges of a pentagon.</p>

            <div className="mt-4 space-y-2">
              <label className="text-xs text-muted-foreground">Shift: {shift}</label>
              <input
                type="range"
                min={0}
                max={25}
                value={shift}
                onChange={(e) => setShift(Number(e.target.value))}
                className="w-full"
                aria-label="Caesar shift amount"
              />
              <div className="text-xs text-muted-foreground">Preview</div>
              <div className="font-mono text-base bg-background/60 rounded px-2 py-1 border">{preview}</div>
              <Button className="mt-2" onClick={handleAcceptDecryption} disabled={cipherSolved}>
                Confirm Decryption
              </Button>
            </div>
          </section>

          {/* Code Injection Panel */}
          <section className={`p-4 rounded-md border ${injectionSolved ? 'bg-ctf-success/10' : 'bg-muted/40'}`}>
            <h3 className="text-sm font-semibold mb-2">Code Injection Hunt</h3>
            <p className="text-xs text-muted-foreground mb-3">Find the vulnerable line. Click to mark it.</p>
            <pre className="text-xs md:text-sm overflow-auto rounded-md border bg-background/60 p-3">
              {codeLines.map((ln, idx) => (
                <div
                  key={idx}
                  role="button"
                  onClick={() => onCodeClick(idx)}
                  className={`group flex gap-3 items-start px-2 py-1 rounded hover-scale cursor-pointer border-transparent border ${
                    idx === vulnerableIndex && injectionSolved ? 'bg-ctf-success/10 text-ctf-success' : 'hover:border-ring/40'
                  }`}
                  aria-label={`Code line ${idx + 1}`}
                >
                  <span className="w-8 shrink-0 text-muted-foreground select-none">{idx + 1}</span>
                  <code className="whitespace-pre-wrap leading-relaxed">
                    {ln}
                  </code>
                </div>
              ))}
            </pre>
          </section>
        </div>

        {feedback && (
          <div className={`p-3 rounded border ${feedback.includes('✅') ? 'bg-ctf-success/10 text-ctf-success' : 'bg-muted/40 text-muted-foreground'} animate-fade-in`}>
            {feedback}
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default PuzzleRoom5;
