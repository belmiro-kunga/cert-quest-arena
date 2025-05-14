
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuestionCard from '@/components/QuestionCard';
import Timer from '@/components/Timer';
import AttemptCounter from '@/components/AttemptCounter';
// TODO: Defina awsCloudPractitionerQuestions e ExamResult localmente ou use dados reais

type ExamResult = {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  timeTaken: number;
  answers: Array<{
    questionId: number;
    selectedOptionId: string;
    isCorrect: boolean;
  }>;
};

const QuizPage = () => {
  const { certificationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado do quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [examStartTime] = useState(Date.now());

  // TODO: Carregue as questões reais do backend ou forneça mocks válidos
  // Exemplo de mock temporário:
  const awsCloudPractitionerQuestions: any[] = [
    {
      id: 1,
      text: 'Qual é o principal serviço de computação em nuvem da AWS?',
      options: [
        { id: 'a', text: 'Amazon EC2' },
        { id: 'b', text: 'Amazon S3' },
        { id: 'c', text: 'Amazon RDS' },
        { id: 'd', text: 'Amazon VPC' }
      ],
      correctOptionId: 'a',
      explanation: 'O Amazon EC2 é o principal serviço de computação em nuvem da AWS.'
    }
  ];
  const questions = awsCloudPractitionerQuestions;

  useEffect(() => {
    // Carregue as questões reais do backend ou forneça mocks válidos
  }, []);

  // Manipuladores de eventos
  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questions[currentQuestionIndex]?.id]: optionId
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishExam();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishExam = () => {
    const timeTaken = Math.round((Date.now() - examStartTime) / 1000);
    
    const answers = Object.keys(selectedOptions).map(questionId => {
      const qId = parseInt(questionId);
      const question = questions.find(q => q.id === qId);
      const selectedOptionId = selectedOptions[qId];
      
      return {
        questionId: qId,
        selectedOptionId: selectedOptionId,
        isCorrect: question ? selectedOptionId === question.correctOptionId : false
      };
    });
    
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    
    const result: ExamResult = {
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers: questions.length - correctAnswers,
      score: Math.round((correctAnswers / questions.length) * 100),
      timeTaken,
      answers
    };
    
    // Armazenar resultado localmente e navegar para a página de resultados
    localStorage.setItem('examResult', JSON.stringify(result));
    navigate(`/results/${certificationId}`);
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  const handleTimeUp = () => {
    toast({
      title: "Tempo esgotado!",
      description: "O tempo para o simulado terminou.",
      variant: "destructive"
    });
    finishExam();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">
                {certificationId === 'aws-cloud-practitioner' ? 'AWS Cloud Practitioner' : certificationId}
              </h1>
              <Timer initialSeconds={600} onTimeUp={handleTimeUp} />
            </div>
            
            <Progress className="mb-8" value={(currentQuestionIndex + 1) / questions.length * 100} />
            
            <div className="mb-1 flex justify-between text-sm text-gray-500">
              <span>Questão {currentQuestionIndex + 1} de {questions.length}</span>
              <AttemptCounter attemptsUsed={2} totalAttempts={3} />
            </div>
            
            <div className="space-y-6 mb-8">
              <QuestionCard
                question={questions[currentQuestionIndex]}
                selectedOption={selectedOptions[questions[currentQuestionIndex].id] || ""}
                onOptionSelect={handleOptionSelect}
              />
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Anterior
              </Button>
              
              <Dialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-red-500 hover:text-red-700">
                    Sair do exame
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tem certeza que deseja sair?</DialogTitle>
                  </DialogHeader>
                  <p className="py-4">Se você sair agora, seu progresso será perdido.</p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsExitDialogOpen(false)}>
                      Continuar simulado
                    </Button>
                    <Button variant="destructive" onClick={handleExit}>
                      Sair
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={finishExam}
                  className="bg-cert-green hover:bg-cert-green/90"
                >
                  Finalizar
                </Button>
              ) : (
                <Button
                  onClick={goToNextQuestion}
                >
                  Próxima
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;
