
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { simuladoService } from '@/services/simuladoService';
import { convertSimuladoFromDB, SimuladoFromDB } from '@/types/simuladoService';
import type { Questao, SimuladoResult } from '@/types/simulado';
import { useToast } from '@/components/ui/use-toast';

interface SimuladoConverted {
  id: string;
  title: string;
  description: string;
  duration: number;
  total_questions: number;
  passing_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  price: number;
  category: string;
  tags: string[];
  image_url?: string;
  questions?: Array<{
    id: string;
    simulado_id: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    points: number;
  }>;
}

export function useSimuladoResult(id?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [simulado, setSimulado] = useState<SimuladoConverted | null>(null);
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
        const simuladoConverted: SimuladoConverted = {
          id: simuladoData.id,
          title: simuladoData.titulo || simuladoData.title || '',
          description: simuladoData.descricao || simuladoData.description || '',
          duration: simuladoData.duracao_minutos || 60,
          total_questions: simuladoData.numero_questoes || simuladoData.total_questions || 0,
          passing_score: simuladoData.pontuacao_minima || simuladoData.passing_score || 70,
          is_active: simuladoData.ativo || simuladoData.is_active || false,
          created_at: simuladoData.data_criacao || simuladoData.created_at || new Date().toISOString(),
          updated_at: simuladoData.data_atualizacao || simuladoData.updated_at || new Date().toISOString(),
          price: simuladoData.preco_usd || 0,
          category: simuladoData.categoria || 'general',
          tags: [],
          image_url: undefined,
          questions: (simuladoData as any).questions || []
        };
        
        setSimulado(simuladoConverted);

        // Convert questions to Questao type
        const questoesData: Questao[] = (simuladoConverted.questions || []).map(q => ({
          id: parseInt(q.id),
          simulado_id: parseInt(q.simulado_id),
          enunciado: q.question_text,
          alternativas: q.options.map((opt, idx) => ({
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
