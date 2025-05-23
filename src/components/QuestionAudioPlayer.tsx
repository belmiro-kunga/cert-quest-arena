import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AudioProgress } from '@/components/AudioProgress';
import { transcriptionService } from '@/services/transcriptionService';
import { useToast } from '@/components/ui/use-toast';

interface QuestionAudioPlayerProps {
  audioUrl: string;
  className?: string;
  onTranscriptionReady?: (transcription: string) => void;
  onSummaryReady?: (summary: string) => void;
}

export const QuestionAudioPlayer: React.FC<QuestionAudioPlayerProps> = ({ 
  audioUrl, 
  className,
  onTranscriptionReady,
  onSummaryReady
}) => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Carregar transcrição quando o componente montar
  useEffect(() => {
    if (audioUrl && !transcription) {
      loadTranscription();
    }
  }, [audioUrl]);

  const loadTranscription = async () => {
    try {
      setIsTranscribing(true);
      const result = await transcriptionService.transcribeAudio(audioUrl);
      setTranscription(result.text);
      setSummary(await transcriptionService.generateSummary(result.text));
      
      if (onTranscriptionReady) {
        onTranscriptionReady(result.text);
      }
      if (onSummaryReady) {
        onSummaryReady(summary);
      }
    } catch (error) {
      console.error('Erro ao carregar transcrição:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolume(value);
    }
  };

  const downloadAudio = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `explicacao-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar áudio:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao baixar o áudio.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={cn(
      'flex flex-col gap-2 p-2 rounded-lg bg-muted/50',
      className
    )}>
      <div className="flex items-center gap-2">
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="flex-1"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleVolumeChange(0)}
          className="opacity-70 hover:opacity-100"
        >
          <Volume2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleVolumeChange(0)}
          className="opacity-70 hover:opacity-100"
        >
          <VolumeX className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={downloadAudio}
          disabled={isDownloading}
          className="opacity-70 hover:opacity-100"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <AudioProgress audioUrl={audioUrl} className="mt-2" />

      {transcription && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => {
              navigator.clipboard.writeText(transcription).then(() => {
                toast({
                  title: 'Copiado',
                  description: 'Transcrição copiada para a área de transferência',
                });
              });
            }}
          >
            <ArrowUpRight className="h-4 w-4" />
            Copiar transcrição completa
          </Button>

          {summary && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                Resumo: {summary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
