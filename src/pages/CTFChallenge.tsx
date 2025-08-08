import React, { useState } from 'react';
import CTFHeader from '@/components/CTFHeader';
import ctfBg from '@/assets/ctf-bg.jpg';
import PuzzleRoom1 from '@/components/puzzles/PuzzleRoom1';
import PuzzleRoom2 from '@/components/puzzles/PuzzleRoom2';
import PuzzleRoom3 from '@/components/puzzles/PuzzleRoom3';
import PuzzleRoom4 from '@/components/puzzles/PuzzleRoom4';
import PuzzleRoom5 from '@/components/puzzles/PuzzleRoom5';
import FinalPortal from '@/components/FinalPortal';

const CTFChallenge: React.FC = () => {
  const [alias, setAlias] = useState('');
  const [started, setStarted] = useState(false);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [flags, setFlags] = useState<string[]>([]);

  const startGame = () => setStarted(true);

  const onSolved = (id: number, flag: string) => {
    setSolved((prev) => new Set([...prev, id]));
    setFlags((prev) => (prev.includes(flag) ? prev : [...prev, flag]));
  };

  const isUnlocked = (id: number) => {
    if (!started) return false;
    if (id === 1) return true;
    return solved.has(id - 1);
  };

  const allSolved = flags.length === 4;

  return (
    <div
      className="min-h-screen bg-background cyber-grid relative"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url(${ctfBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <CTFHeader completedSections={solved.size} totalSections={5} />

        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ctf-primary">ML CTF: Quantum Protocol</h1>
          <p className="text-muted-foreground mt-2">Frontend-only, immersive puzzle experience</p>
        </header>

        {!started ? (
          <section className="mb-8 animate-fade-in">
            <div className="mx-auto max-w-xl p-6 rounded-lg border neon-border bg-card/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-3">Entry Terminal</h2>
              <label className="block text-sm mb-2">Agent Alias</label>
              <input
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Enter your alias"
                className="w-full h-11 rounded-md border bg-background px-3"
                aria-label="Agent alias"
              />
              <button
                onClick={startGame}
                className="mt-4 w-full h-11 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition pulse-neon"
              >
                Begin Mission
              </button>
            </div>
          </section>
        ) : (
          <main className="space-y-8">
            <PuzzleRoom1 isUnlocked={isUnlocked(1)} onSolved={(flag) => onSolved(1, flag)} />
            <PuzzleRoom2 isUnlocked={isUnlocked(2)} onSolved={(flag) => onSolved(2, flag)} />
            <PuzzleRoom3 isUnlocked={isUnlocked(3)} onSolved={(flag) => onSolved(3, flag)} />
            <PuzzleRoom4 isUnlocked={isUnlocked(4)} onSolved={(flag) => onSolved(4, flag)} />
            <PuzzleRoom5 isUnlocked={isUnlocked(5)} onSolved={() => setSolved((prev) => new Set([...prev, 5]))} />

            <FinalPortal alias={alias} flags={flags} isUnlocked={solved.has(5)} msFormLink={"https://forms.microsoft.com/r/your-form-id"} />
          </main>
        )}

        <footer className="text-center mt-12 py-8 border-t border-ctf-primary/20">
          <p className="text-muted-foreground text-sm">🚀 Ready to advance your ML journey? Complete the challenge above!</p>
          <p className="text-xs text-muted-foreground mt-2">Built for curious minds | Zero-backend edition | Developed by Jagaputhran S ❤️</p>
        </footer>
      </div>
    </div>
  );
};

export default CTFChallenge;
