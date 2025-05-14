
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Tipos temporários locais para ExamResult e Question
type ExamResult = {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  timeTaken: number;
  answers: any[];
};
type Question = {
  id: number;
  text: string; // Corrigido para corresponder ao uso
  explanation?: string; // Corrigido para corresponder ao uso
  options: { id: string; text: string }[];
  correctOptionId: string;
};
// Mock local vazio para awsCloudPractitionerQuestions
const awsCloudPractitionerQuestions: Question[] = [];


const ResultPage = () => {
  const { certificationId } = useParams();
  const navigate = useNavigate();
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Recuperar resultados do exame do localStorage
    const storedResult = localStorage.getItem('examResult');
    if (storedResult) {
      setExamResult(JSON.parse(storedResult));
    } else {
      // Redirecionar se não houver resultados
      navigate('/dashboard');
    }

    // Definir as questões (ou recuperar de um serviço)
    setQuestions(awsCloudPractitionerQuestions.slice(0, 10));
  }, [navigate]);

  const handleTryAgain = () => {
    // Limpar os resultados anteriores
    localStorage.removeItem('examResult');
    // Redirecionar para iniciar um novo simulado
    navigate(`/exams/${certificationId}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (!examResult) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

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
                  const answer = examResult.answers.find(a => a.questionId === question.id);
                  const selectedOption = answer?.selectedOptionId || "";
                  const isCorrect = answer?.isCorrect || false;
                  
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
                  onClick={handleBackToDashboard}
                >
                  Voltar para Dashboard
                </Button>
                <Button 
                  onClick={handleTryAgain}
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
};

export default ResultPage;
