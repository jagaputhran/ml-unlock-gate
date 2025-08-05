import React from 'react';
import { Brain, Shield, Zap } from 'lucide-react';

interface CTFHeaderProps {
  completedSections: number;
  totalSections: number;
}

const CTFHeader: React.FC<CTFHeaderProps> = ({ completedSections, totalSections }) => {
  const progressPercent = (completedSections / totalSections) * 100;

  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Brain className="w-12 h-12 text-ctf-primary animate-pulse" />
        <Shield className="w-10 h-10 text-ctf-secondary" />
        <Zap className="w-8 h-8 text-ctf-success" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold glitch-text text-ctf-primary">
          Unlock the ML Portal
        </h1>
        <p className="text-xl md:text-2xl text-ctf-secondary font-semibold">
          🧠🔐 Interactive CTF Challenge
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Master the fundamentals of Machine Learning through this hacker-style challenge. 
          Solve 4 puzzles, collect the flags, and unlock exclusive access to our ML learning session!
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Mission Progress</span>
          <span>{completedSections}/{totalSections} Complete</span>
        </div>
        <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-ctf-primary to-ctf-success transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm">
        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-ctf-primary/10 border border-ctf-primary/30">
          <span className="text-ctf-primary">🎯</span>
          <span>No coding required</span>
        </div>
        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-ctf-secondary/10 border border-ctf-secondary/30">
          <span className="text-ctf-secondary">⚡</span>
          <span>Interactive learning</span>
        </div>
        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-ctf-success/10 border border-ctf-success/30">
          <span className="text-ctf-success">🏆</span>
          <span>Unlock ML session</span>
        </div>
      </div>
    </div>
  );
};

export default CTFHeader;