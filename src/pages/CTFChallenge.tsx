import React, { useState, useEffect } from 'react';
import CTFHeader from '@/components/CTFHeader';
import CTFPuzzle from '@/components/CTFPuzzle';
import FlagPortal from '@/components/FlagPortal';
import ctfBg from '@/assets/ctf-bg.jpg';

interface PuzzleData {
  id: number;
  title: string;
  emoji: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  flag: string;
  funFact: string;
}

const CTFChallenge: React.FC = () => {
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<number>>(new Set());
  const [collectedFlags, setCollectedFlags] = useState<string[]>([]);

  const puzzles: PuzzleData[] = [
    {
      id: 1,
      title: "ML Lens 🔍",
      emoji: "🔍",
      question: "You have a model that predicts whether an email is spam or not. What type of ML task is this?",
      choices: ["Regression", "Reinforcement", "Classification", "Clustering"],
      correctAnswer: 2,
      flag: "FLAG{classifier}",
      funFact: "Classification tasks predict discrete categories or classes. Other examples include image recognition (cat vs dog) and sentiment analysis (positive vs negative)!"
    },
    {
      id: 2,
      title: "Label Hunt 🏷️",
      emoji: "🏷️",
      question: "If you train a model with both input data and labeled outputs, what kind of learning is it?",
      choices: ["Semi-supervised", "Unsupervised", "Reinforcement", "Supervised"],
      correctAnswer: 3,
      flag: "FLAG{labels}",
      funFact: "Supervised learning is like learning with a teacher! The model learns from examples where we already know the correct answers. Think of it as studying with answer sheets."
    },
    {
      id: 3,
      title: "Accuracy Matters 📊",
      emoji: "📊",
      question: "Your model made 80 correct predictions out of 100. What is its accuracy?",
      choices: ["0.8", "1.2", "0.2", "80"],
      correctAnswer: 0,
      flag: "FLAG{accuracy80}",
      funFact: "Accuracy = Correct Predictions / Total Predictions. It's expressed as a decimal (0.8) or percentage (80%). Perfect accuracy is 1.0 or 100%!"
    },
    {
      id: 4,
      title: "ML is Everywhere 🌍",
      emoji: "🌍",
      question: "Which of the following is **not** a typical use of ML?",
      choices: ["Predicting weather", "Recommending movies", "Email auto-categorization", "Making toast"],
      correctAnswer: 3,
      flag: "FLAG{not_toast}",
      funFact: "While ML can't literally make toast, it's everywhere else! From Netflix recommendations to voice assistants, ML is transforming how we interact with technology daily."
    }
  ];

  const handlePuzzleSolve = (puzzleId: number, flag: string) => {
    setSolvedPuzzles(prev => new Set([...prev, puzzleId]));
    setCollectedFlags(prev => [...prev, flag]);
  };

  const isPuzzleUnlocked = (puzzleId: number) => {
    if (puzzleId === 1) return true;
    return solvedPuzzles.has(puzzleId - 1);
  };

  const isPortalUnlocked = solvedPuzzles.size === puzzles.length;

  return (
    <div 
      className="min-h-screen bg-background cyber-grid relative"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url(${ctfBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <CTFHeader 
          completedSections={solvedPuzzles.size}
          totalSections={puzzles.length}
        />
        
        <div className="space-y-8">
          {puzzles.map((puzzle) => (
            <CTFPuzzle
              key={puzzle.id}
              {...puzzle}
              isUnlocked={isPuzzleUnlocked(puzzle.id)}
              onSolve={handlePuzzleSolve}
            />
          ))}
          
          <FlagPortal 
            collectedFlags={collectedFlags}
            isUnlocked={isPortalUnlocked}
          />
        </div>

        <footer className="text-center mt-12 py-8 border-t border-ctf-primary/20">
          <p className="text-muted-foreground text-sm">
            🚀 Ready to advance your ML journey? Complete the challenge above!
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Built with ❤️ for curious minds | Powered by Interactive Learning
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CTFChallenge;