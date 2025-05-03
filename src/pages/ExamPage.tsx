
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { awsCloudPractitionerQuestions } from '@/data/examData';
import { ExamResult } from '@/types/exam';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ExamPage = () => {
  const { certificationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos (freemium)
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [examStartTime] = useState(Date.now());
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Por enquanto, só temos questões para AWS Cloud Practitioner
  const questions = awsCloudPractitionerQuestions.slice(0, 10); // Limita a 10 questões (freemium)

  useEffect(() => {
    // Timer para o exame
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: optionId
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
    
    setExamResult(result);
    setIsExamFinished(true);
  };

  const handleExit = () => {
    navigate('/certifications');
  };

  if (isExamFinished && examResult) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8 px-4">
          <div className="container mx-auto max-w-3xl">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Resultado do Simulado</h1>
                  <p className="text-gray-600">
                    {certificationId === 'aws-cloud-practitioner' ? 'AWS Certified Cloud Practitioner' : certificationId}
                  </p>
                </div>
                
                <div className="flex justify-center mb-8">
                  <div className="w-48 h-48 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl font-bold">{examResult.score}%</span>
                        <p className="text-sm text-gray-500">Pontuação</p>
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="8" 
                      />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke={examResult.score >= 70 ? "#10b981" : "#f59e0b"} 
                        strokeWidth="8" 
                        strokeDasharray="282.7"
                        strokeDashoffset={282.7 - (282.7 * examResult.score / 100)}
                        transform="rotate(-90 50 50)" 
                      />
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-bold text-2xl text-cert-blue">{examResult.totalQuestions}</div>
                    <div className="text-gray-500">Total de Questões</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-bold text-2xl text-green-500">{examResult.correctAnswers}</div>
                    <div className="text-gray-500">Corretas</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-bold text-2xl text-red-500">{examResult.incorrectAnswers}</div>
                    <div className="text-gray-500">Incorretas</div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold mb-2">
                    {examResult.score >= 70 ? "Parabéns!" : "Continue praticando!"}
                  </h2>
                  <p className="text-gray-600">
                    {examResult.score >= 70 
                      ? "Você está no caminho certo para a certificação! Continue estudando para aperfeiçoar ainda mais seus conhecimentos." 
                      : "Você precisa de mais prática neste tema. Não desista, revise o material e tente novamente!"}
                  </p>
                  <p className="text-gray-500 mt-2">
                    Tempo total: {Math.floor(examResult.timeTaken / 60)}min {examResult.timeTaken % 60}s
                  </p>
                </div>
                
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const selectedOption = selectedOptions[question.id];
                    const isCorrect = selectedOption === question.correctOptionId;
                    
                    return (
                      <Card key={question.id} className={`border-l-4 ${
                        !selectedOption ? 'border-l-gray-300' :
                        isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">Questão {index + 1}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              !selectedOption ? 'bg-gray-100 text-gray-600' :
                              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {!selectedOption ? 'Não respondida' :
                              isCorrect ? 'Correta' : 'Incorreta'}
                            </span>
                          </div>
                          <p className="mb-3">{question.text}</p>
                          <div className="ml-4 mb-4">
                            {question.options.map(option => (
                              <div key={option.id} className="flex items-center mb-1">
                                <span className={`inline-block w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs ${
                                  option.id === question.correctOptionId ? 'bg-green-500 text-white' : 
                                  option.id === selectedOption && option.id !== question.correctOptionId ? 'bg-red-500 text-white' : 'bg-gray-200'
                                }`}>
                                  {option.id.toUpperCase()}
                                </span>
                                <span className={`${
                                  option.id === question.correctOptionId ? 'font-medium' : ''
                                }`}>{option.text}</span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm font-medium mb-1">Explicação:</p>
                            <p className="text-sm text-gray-600">{question.explanation}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/certifications')}
                  >
                    Voltar para Certificações
                  </Button>
                  <Button 
                    onClick={() => navigate(`/exams/${certificationId}`)}
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">
                  {certificationId === 'aws-cloud-practitioner' ? 'AWS Cloud Practitioner' : certificationId}
                </h1>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-red-600">Tempo restante:</span>
                  <span className="text-sm font-bold">{formatTime(timeLeft)}</span>
                </div>
              </div>
              
              <Progress className="mb-8" value={(currentQuestionIndex + 1) / questions.length * 100} />
              
              <div className="mb-1 flex justify-between text-sm text-gray-500">
                <span>Questão {currentQuestionIndex + 1} de {questions.length}</span>
              </div>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h2 className="text-lg font-medium mb-4">{questions[currentQuestionIndex].text}</h2>
                  
                  <RadioGroup 
                    value={selectedOptions[questions[currentQuestionIndex].id] || ""} 
                    onValueChange={handleOptionSelect}
                    className="space-y-3"
                  >
                    {questions[currentQuestionIndex].options.map(option => (
                      <div key={option.id} className="flex items-center space-x-2 border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                        <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                        <Label className="flex-grow cursor-pointer" htmlFor={`option-${option.id}`}>
                          <div className="flex">
                            <span className="font-medium mr-2">{option.id.toUpperCase()}.</span>
                            <span>{option.text}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
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
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamPage;
