import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Question, Exam, ExplanationLink } from '@/types/admin';
import { QuestionAnswer } from './QuestionAnswer';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAchievements } from '@/lib/hooks/useAchievements';

interface ExamResultProps {
  exam: Exam;
  answers: Record<string, {
    isCorrect?: boolean;
    partialScore?: number;
    details?: string;
    command?: string;
    output?: string;
  } | string[] | string>;
  onReview: () => void;
  onRetry: () => void;
}

interface QuestionResult {
  question: Question;
  answer: any;
  isCorrect: boolean;
  score: number;
}

const ExplanationWithLinks: React.FC<{
  explanation: string;
  links?: ExplanationLink[];
}> = ({ explanation, links }) => {
  if (!links || links.length === 0) {
    return <p>{explanation}</p>;
  }

  // Substitui os marcadores [link-N] pelos links reais
  let content = explanation;
  links.forEach((link, index) => {
    content = content.replace(
      `[link-${index + 1}]`,
      `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center gap-1" title="${link.title || ''}">${link.text}<ExternalLink className="w-3 h-3" /></a>`
    );
  });

  return (
    <p dangerouslySetInnerHTML={{ __html: content }} />
  );
};

const calculateScore = (question: Question, answer: any): { isCorrect: boolean; score: number } => {
  switch (question.type) {
    case 'multiple_choice':
      const selectedOptions = new Set(answer);
      const correctOptions = new Set(question.correctOptions);
      const isCorrect = selectedOptions.size === correctOptions.size &&
        [...selectedOptions].every(option => correctOptions.has(option));
      return {
        isCorrect,
        score: isCorrect ? question.points : 0,
      };

    case 'single_choice':
      return {
        isCorrect: answer === question.correctOption,
        score: answer === question.correctOption ? question.points : 0,
      };

    case 'drag_and_drop':
      const correctPlacements = question.correctPlacements;
      const isAllCorrect = correctPlacements.every(placement => {
        const itemPlacement = answer[placement.itemId];
        return itemPlacement === placement.targetCategory;
      });
      return {
        isCorrect: isAllCorrect,
        score: isAllCorrect ? question.points : 0,
      };

    case 'fill_in_blank':
      const allBlanksCorrect = question.blanks.every((blank, index) => {
        const userAnswer = answer[index];
        return blank.correctAnswers.some(correct => 
          blank.caseSensitive
            ? correct === userAnswer
            : correct.toLowerCase() === userAnswer?.toLowerCase()
        );
      });
      return {
        isCorrect: allBlanksCorrect,
        score: allBlanksCorrect ? question.points : 0,
      };

    case 'practical_scenario':
    case 'command_line':
    case 'network_topology':
      // Para questões práticas, a validação já foi feita durante o exame
      return {
        isCorrect: answer.isCorrect || false,
        score: (answer.isCorrect ? question.points : 0) * (answer.partialScore || 1),
      };

    default:
      return { isCorrect: false, score: 0 };
  }
};

export const ExamResult: React.FC<ExamResultProps> = ({
  exam,
  answers,
  onReview,
  onRetry,
}) => {
  const { handleExamCompletion } = useAchievements();
  
  // Calcula o resultado de cada questão
  const results: QuestionResult[] = exam.questions.map(question => ({
    question,
    answer: answers[question.id],
    ...calculateScore(question, answers[question.id]),
  }));

  // Calcula estatísticas
  const totalQuestions = results.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const totalPoints = results.reduce((sum, r) => sum + r.question.points, 0);
  const earnedPoints = results.reduce((sum, r) => sum + r.score, 0);
  const percentageScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const passed = percentageScore >= exam.passingScore;

  // Atualiza conquistas quando o componente é montado
  useEffect(() => {
    handleExamCompletion(percentageScore);
  }, [handleExamCompletion, percentageScore]);

  // Agrupa questões por categoria
  const categorizedQuestions = results.reduce((acc, result) => {
    const category = result.question.category;
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        correct: 0,
        points: 0,
        maxPoints: 0,
      };
    }
    acc[category].total++;
    if (result.isCorrect) acc[category].correct++;
    acc[category].points += result.score;
    acc[category].maxPoints += result.question.points;
    return acc;
  }, {} as Record<string, { total: number; correct: number; points: number; maxPoints: number; }>);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Cabeçalho com resultado geral */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{exam.title}</CardTitle>
              <CardDescription>{exam.description}</CardDescription>
            </div>
            <Badge
              variant={passed ? "success" : "destructive"}
              className="text-lg py-2 px-4"
            >
              {passed ? "APROVADO" : "REPROVADO"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={percentageScore} className="h-3" />
              </div>
              <div className="text-2xl font-semibold">
                {percentageScore.toFixed(1)}%
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Nota Final</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {earnedPoints}/{totalPoints}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Questões Corretas</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {correctAnswers}/{totalQuestions}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Nota Mínima</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {exam.passingScore}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Tempo Total</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {exam.duration} min
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categorizedQuestions).map(([category, stats]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{category}</h4>
                  <div className="text-sm text-muted-foreground">
                    {stats.correct}/{stats.total} questões corretas
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Progress
                    value={(stats.points / stats.maxPoints) * 100}
                    className="h-2"
                  />
                  <div className="text-sm font-medium w-20">
                    {stats.points}/{stats.maxPoints} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de questões com respostas */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Revisão das Questões</h3>

        {results.map((result, index) => (
          <Card key={result.question.id} className={cn(
            "border-l-4",
            result.isCorrect
              ? "border-l-green-500"
              : "border-l-red-500"
          )}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">
                      Questão {index + 1}
                    </span>
                    <Badge variant="outline">
                      {result.question.points} pontos
                    </Badge>
                    <Badge variant={
                      result.question.difficulty === 'Fácil'
                        ? "secondary"
                        : result.question.difficulty === 'Médio'
                        ? "default"
                        : "destructive"
                    }>
                      {result.question.difficulty}
                    </Badge>
                  </div>
                  <p className="mt-2">{result.question.text}</p>
                </div>
                {result.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Exibe a resposta do aluno e a resposta correta */}
              <div className="space-y-2">
                <h4 className="font-medium">Sua Resposta:</h4>
                <QuestionAnswer
                  question={result.question}
                  answer={result.answer}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Resposta Correta:</h4>
                <QuestionAnswer
                  question={result.question}
                  answer={result.answer}
                  showCorrect
                />
              </div>

              <div className="space-y-2 bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  <h4 className="font-medium">Explicação:</h4>
                </div>
                <ExplanationWithLinks
                  explanation={result.question.explanation}
                  links={result.question.explanationLinks}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onReview}>
          Revisar Questões
        </Button>
        <Button onClick={onRetry}>
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
};
