import { toast } from '@/components/ui/use-toast';

interface TranscriptionResult {
  text: string;
  confidence: number;
  duration: number;
}

export const transcriptionService = {
  async transcribeAudio(audioUrl: string): Promise<TranscriptionResult> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transcribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioUrl }),
      });

      if (!response.ok) {
        throw new Error('Erro ao transcrever áudio');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro na transcrição:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao transcrever o áudio. Por favor, tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  },

  async generateSummary(text: string): Promise<string> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar resumo');
      }

      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao gerar resumo. Por favor, tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  },
};
