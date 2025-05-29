
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { simuladoService } from '@/services/simuladoService';
import { convertSimuladoFromDB, SimuladoFromDB, Simulado } from '@/types/simuladoService';
import type { Questao, SimuladoResult } from '@/types/simulado';
import { useToast } from '@/components/ui/use-toast';

export function useSimuladoResult(id?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulado, setSimulado] = useState<Simulado | null>(null);
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
        
        const simuladoData = await simuladoService.getSimuladoById(id);
        if (!simuladoData) {
          throw new Error('Simulado não encontrado');
        }

        // Convert database format to expected format
        const simuladoConverted: Simulado = convertSimuladoFromDB(simuladoData as SimuladoFromDB);
        
        setSimulado(simuladoConverted);

        // Convert questions to Questao type
        const questoesData: Questao[] = ((simuladoData as any).questions || []).map((q: any) => ({
          id: parseInt(q.id),
          simulado_id: parseInt(q.simulado_id),
          enunciado: q.question_text,
          alternativas: q.options.map((opt: string, idx: number) => ({
            id: `opt_${idx}`,
            texto: opt,
            correta: opt === q.correct_answer
          })),
          resposta_correta: q.correct_answer,
          explicacao: q.explanation,
          tipo: 'single_choice' as const
        }));
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
