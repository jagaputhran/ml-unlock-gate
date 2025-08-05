import React, { useState, useEffect } from 'react';
import CTFHeader from '@/components/CTFHeader';
import CTFPuzzle from '@/components/CTFPuzzle';
import FlagPortal from '@/components/FlagPortal';
import LeaderBoard from '@/components/LeaderBoard';
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
  const [startTime] = useState<number>(Date.now());

  const puzzles: PuzzleData[] = [
    {
      id: 1,
      title: "Neural Network Decoder 🧠",
      emoji: "🧠",
      question: "A neural network has 3 input nodes, 2 hidden layers with 4 nodes each, and 1 output node. How many total connections (weights) exist between all layers?",
      choices: ["25", "12", "21", "17"],
      correctAnswer: 2,
      flag: "FLAG{neural_maze}",
      funFact: "Neural networks learn by adjusting weights! Input-to-hidden: 3×4=12, hidden-to-hidden: 4×4=16, hidden-to-output: 4×1=4. But wait... there are only 2 hidden layers, so it's (3×4) + (4×4) + (4×1) = 21 connections total!"
    },
    {
      id: 2,
      title: "Data Mining Challenge ⛏️",
      emoji: "⛏️",
      question: "You have a dataset with 1000 samples. After splitting: 600 training, 200 validation, 200 test. Your model achieves 95% accuracy on training but only 70% on validation. What's happening?",
      choices: ["Underfitting", "Perfect performance", "Overfitting", "Data corruption"],
      correctAnswer: 2,
      flag: "FLAG{overfit_trap}",
      funFact: "Overfitting is like memorizing answers without understanding! The model learned the training data too well but can't generalize to new data. It's the difference between cramming and true learning."
    },
    {
      id: 3,
      title: "Algorithm Battlefield ⚔️",
      emoji: "⚔️",
      question: "You need to predict house prices based on size, location, and age. Which algorithm combination would be most effective for this regression task?",
      choices: ["K-Means + SVM", "Random Forest + Cross-validation", "Decision Tree only", "Logistic Regression + PCA"],
      correctAnswer: 1,
      flag: "FLAG{forest_power}",
      funFact: "Random Forest is perfect for regression with mixed data types! It handles numerical (size, age) and categorical (location) features well, while cross-validation ensures robust performance measurement."
    },
    {
      id: 4,
      title: "Feature Engineering Puzzle 🔧",
      emoji: "🔧",
      question: "You're building a spam detector. Which feature engineering technique would be LEAST helpful for improving email classification?",
      choices: ["TF-IDF vectorization of email text", "One-hot encoding sender domains", "Normalizing timestamp to business hours", "Adding sender's geographical coordinates"],
      correctAnswer: 3,
      flag: "FLAG{feature_master}",
      funFact: "Geographical coordinates of senders are rarely useful for spam detection! TF-IDF finds important words, domain encoding catches suspicious senders, and time normalization reveals spam patterns, but location is usually irrelevant for email content analysis."
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
            startTime={startTime}
          />
          
          <LeaderBoard />
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