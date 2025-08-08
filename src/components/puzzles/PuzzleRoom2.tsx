import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFlag } from '@/utils/flagUtils';

interface PuzzleRoom2Props {
  onSolved: (flag: string) => void;
  isUnlocked: boolean;
}

// Datasets: only one is fully labeled
const items = [
  { id: 'unlabeled', title: 'Unlabeled Cloud', density: 60, labeled: 0 },
  { id: 'partial', title: 'Partially Labeled Set', density: 80, labeled: 0.45 },
  { id: 'full', title: 'Fully Labeled Dataset', density: 100, labeled: 1 },
] as const;

type Point = { x: number; y: number; labeled: boolean };

function useDatasetPoints(seed: string, density: number, labeledRatio: number, width: number, height: number) {
  // Simple seeded RNG for stable point generation across renders
  const rng = useMemo(() => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return () => {
      h += 0x6d2b79f5;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }, [seed]);

  return useMemo<Point[]>(() => {
    const pts: Point[] = [];
    for (let i = 0; i < density; i++) {
      const x = Math.floor(rng() * (width - 16)) + 8;
      const y = Math.floor(rng() * (height - 16)) + 8;
      const labeled = rng() < labeledRatio;
      pts.push({ x, y, labeled });
    }
    return pts;
  }, [density, labeledRatio, rng, width, height]);
}

const MagnifierField: React.FC<{
  id: string;
  title: string;
  density: number;
  labeled: number;
  onClick: () => void;
}> = ({ id, title, density, labeled, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [lens, setLens] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const radius = 56;

  // Resize canvas to container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.floor(rect.width), h: 160 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Resolve CSS vars for canvas colors
  const cssColor = (name: string) => `hsl(${getComputedStyle(document.documentElement).getPropertyValue(name).trim()})`;
  const baseColor = cssColor('--muted-foreground');
  const labelColor = cssColor('--primary');
  const bgColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--card').trim()})`;
  const ringColor = cssColor('--ring');

  const points = useDatasetPoints(id, density, labeled, Math.max(size.w, 1), Math.max(size.h, 1));

  // Draw scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // background
    ctx.clearRect(0, 0, size.w, size.h);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size.w, size.h);

    // base dots (hidden labels)
    ctx.fillStyle = baseColor;
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (lens.active) {
      // Clip to magnifier circle and reveal labels
      ctx.save();
      ctx.beginPath();
      ctx.arc(lens.x, lens.y, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = labelColor;
      for (const p of points) {
        if (!p.labeled) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Lens ring
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = ringColor;
      ctx.arc(lens.x, lens.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Lens glare
      const grad = ctx.createRadialGradient(lens.x - radius / 3, lens.y - radius / 3, 5, lens.x, lens.y, radius);
      grad.addColorStop(0, 'rgba(255,255,255,0.15)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lens.x, lens.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [points, lens, size.w, size.h, baseColor, labelColor, bgColor, ringColor]);

  const onMove: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLens({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
  };
  return (
    <button
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => setLens((l) => ({ ...l, active: false }))}
      className="text-left space-y-2 group"
      aria-label={`${title}. Move lens to reveal labels, then click the correct dataset`}
    >
      <div ref={containerRef} className="relative w-full h-40 overflow-hidden rounded-md border bg-card/80 backdrop-blur-sm">
        <canvas ref={canvasRef} width={size.w} height={size.h} className="absolute inset-0 w-full h-full" />
        {!lens.active && (
          <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
            Move the lens to reveal labels
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">Hover to scan. Click if you think it’s fully labeled.</div>
    </button>
  );
};

const PuzzleRoom2: React.FC<PuzzleRoom2Props> = ({ onSolved, isUnlocked }) => {
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const choose = (id: string) => {
    if (solved) return;
    if (id === 'full') {
      setSolved(true);
      setMessage('✅ Correct! Fully labeled data enables supervised learning.');
      onSolved(getFlag('labels'));
    } else {
      setMessage('Not quite. Scan for the dataset where every point is labeled.');
    }
  };

  return (
    <Card className={`transition-all ${isUnlocked ? 'neon-border' : 'opacity-60 pointer-events-none'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Room 2</Badge>
          Label Hunt — Magnifier Reveal
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4">
        {items.map((it) => (
          <MagnifierField key={it.id} id={it.id} title={it.title} density={it.density} labeled={it.labeled} onClick={() => choose(it.id)} />
        ))}
        {message && (
          <div className={`md:col-span-3 p-3 rounded border ${solved ? 'bg-ctf-success/10 text-ctf-success' : 'bg-muted/40 text-muted-foreground'}`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuzzleRoom2;
