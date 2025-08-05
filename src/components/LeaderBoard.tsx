import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Users } from 'lucide-react';
import { supabase, type CTFCompletion } from '@/lib/supabase';

const LeaderBoard: React.FC = () => {
  const [completions, setCompletions] = useState<CTFCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletions();
  }, []);

  const fetchCompletions = async () => {
    try {
      const { data, error } = await supabase
        .from('ctf_completions')
        .select('*')
        .order('completion_time_seconds', { ascending: true })
        .limit(10);

      if (error) throw error;
      setCompletions(data || []);
    } catch (error) {
      console.error('Error fetching completions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card className="neon-border bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-ctf-primary glitch-text">
            <Trophy className="w-6 h-6 inline mr-2" />
            ML Champions Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 animate-spin" />
            Loading leaderboard...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="neon-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <Users className="w-6 h-6 text-ctf-primary" />
        </div>
        <CardTitle className="text-ctf-primary glitch-text text-xl">
          ML Champions Leaderboard
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Top performers who cracked the ML challenge
        </p>
      </CardHeader>
      
      <CardContent>
        {completions.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No champions yet! Be the first to complete the challenge.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {completions.map((completion, index) => (
              <div
                key={completion.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                  index === 0
                    ? 'border-yellow-500 bg-yellow-500/10 neon-glow'
                    : index === 1
                    ? 'border-gray-400 bg-gray-400/10'
                    : index === 2
                    ? 'border-orange-600 bg-orange-600/10'
                    : 'border-ctf-primary/30 bg-ctf-primary/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={index < 3 ? 'default' : 'outline'}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? 'bg-yellow-500 text-black'
                        : index === 1
                        ? 'bg-gray-400 text-black'
                        : index === 2
                        ? 'bg-orange-600 text-white'
                        : ''
                    }`}
                  >
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-semibold text-foreground">
                      {completion.user_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(completion.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-ctf-success">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono text-sm">
                        {formatTime(completion.completion_time_seconds)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {completion.flags_collected.length}/4 flags
                    </p>
                  </div>
                  {index < 3 && (
                    <Trophy
                      className={`w-5 h-5 ${
                        index === 0
                          ? 'text-yellow-500'
                          : index === 1
                          ? 'text-gray-400'
                          : 'text-orange-600'
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 text-center text-xs text-muted-foreground border-t border-ctf-primary/20 pt-4">
          <p>🎯 Challenge yourself to reach the top!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderBoard;