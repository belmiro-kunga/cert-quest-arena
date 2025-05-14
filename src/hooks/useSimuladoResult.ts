import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSimuladoById, Exam } from '@/services/simuladoService';
import { getQuestoesBySimuladoId } from '@/services/questaoService';
import type { Questao, SimuladoResult } from '@/types/simulado';
import { useToast } from '@/components/ui/use-toast';

export interface SimuladoResult {
  simuladoId: string;
  answers: Record<number, string>;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  timeSpent: number;
  passedExam: boolean;
  completedAt: string;
}

export function useSimuladoResult(id?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulado, setSimulado] = useState<Exam | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [result, setResult] = useState<SimuladoResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setIsLoading(true);
        const storedResult = localStorage.getItem(`simulado_result_${id}`);
        if (!storedResult) {
          toast({
            title: 'Erro',
            description: 'Resultado do simulado não encontrado.',
            variant: 'destructive',
          });
          navigate(`/simulados/${id}`);
          return;
        }
        const resultData = JSON.parse(storedResult) as SimuladoResult;
        setResult(resultData);
        const simuladoData = await getSimuladoById(parseInt(id));
        setSimulado(simuladoData);
        const questoesData = await getQuestoesBySimuladoId(parseInt(id));
        setQuestoes(questoesData);
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do resultado.',
          variant: 'destructive',
        });
        navigate('/simulados');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, navigate, toast]);

  return { simulado, questoes, result, isLoading };
}
