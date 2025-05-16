import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Check, X } from 'lucide-react';
import type { Questao, Alternativa } from '@/types/simulado';

interface SimuladoReviewCardProps {
  questao: Questao;
  userAnswerId?: string | string[];
  isCorrect: boolean;
  index: number;
}

export const SimuladoReviewCard: React.FC<SimuladoReviewCardProps> = ({ questao, userAnswerId, isCorrect, index }) => {
  // Converter resposta do usuário para array para facilitar o processamento
  const userAnswerArray = userAnswerId 
    ? (Array.isArray(userAnswerId) ? userAnswerId : [userAnswerId]) 
    : [];
  
  // Converter resposta correta para array para facilitar o processamento
  const correctAnswerArray = questao.resposta_correta 
    ? (Array.isArray(questao.resposta_correta) ? questao.resposta_correta : [questao.resposta_correta]) 
    : [];
  
  // Verificar se é questão de múltipla escolha
  const isMultipleChoice = questao.tipo === 'multiple_choice';
  
  return (
    <Card 
      key={questao.id} 
      className={`shadow border ${isCorrect ? 'border-green-200 bg-green-50/60' : 'border-red-200 bg-red-50/60'} transition-all duration-200`}
    >
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle 
            className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2"
            id={`questao-${questao.id}-titulo`}
          >
            {isCorrect ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-500" aria-hidden="true" />
                <span className="sr-only">Resposta correta</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-500" aria-hidden="true" />
                <span className="sr-only">Resposta incorreta</span>
              </>
            )}
            Questão {index + 1}
            {isMultipleChoice && (
              <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-300">
                Múltipla Escolha
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-lg text-gray-700">
            {questao.enunciado}
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={isCorrect ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}>
            {isCorrect ? 'Correta' : 'Incorreta'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="flex flex-col gap-2"
          aria-labelledby={`questao-${questao.id}-titulo`}
        >
          <span 
            className="text-gray-500 font-medium"
            id={`questao-${questao.id}-respostas-titulo`}
          >
            {isMultipleChoice ? 'Suas respostas:' : 'Sua resposta:'}
          </span>
          <div 
            className="space-y-2"
            role="list"
            aria-labelledby={`questao-${questao.id}-respostas-titulo`}
          >
            {questao.alternativas.map((alternativa, altIndex) => {
              const isUserSelected = userAnswerArray.includes(alternativa.id);
              const isCorrectOption = correctAnswerArray.includes(alternativa.id);
              
              // Determinar a classe de estilo baseada nas condições
              let styleClass = 'bg-gray-100 text-gray-600';
              
              if (isUserSelected) {
                if (isCorrectOption) {
                  // Usuário selecionou e está correto
                  styleClass = 'bg-green-100 text-green-700 font-semibold border border-green-300';
                } else {
                  // Usuário selecionou mas está errado
                  styleClass = 'bg-red-100 text-red-700 font-semibold border border-red-300';
                }
              } else if (isCorrectOption) {
                // Usuário não selecionou mas era opção correta
                styleClass = 'bg-yellow-50 text-yellow-700 border border-yellow-200';
              }
              
              // Gerar mensagem de status para leitores de tela
              let statusMessage = '';
              if (isUserSelected) {
                if (isCorrectOption) {
                  statusMessage = 'Você selecionou esta opção e está correta';
                } else {
                  statusMessage = 'Você selecionou esta opção, mas está incorreta';
                }
              } else if (isCorrectOption) {
                statusMessage = 'Esta é uma resposta correta que você não selecionou';
              } else {
                statusMessage = 'Opção incorreta não selecionada';
              }
              
              return (
                <div
                  key={alternativa.id}
                  className={`flex items-start gap-2 p-2 rounded-md ${styleClass}`}
                  role="listitem"
                  aria-describedby={`alternativa-${alternativa.id}-status`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isUserSelected ? (
                      isCorrectOption ? (
                        <Check className="w-5 h-5 text-green-600" aria-hidden="true" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" aria-hidden="true" />
                      )
                    ) : (
                      isCorrectOption ? (
                        <Check className="w-5 h-5 text-yellow-600 opacity-70" aria-hidden="true" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-300" aria-hidden="true" />
                      )
                    )}
                  </div>
                  <div className="flex-grow">
                    <span className="block">
                      <span className="sr-only">Alternativa {altIndex + 1}: </span>
                      {alternativa.texto}
                    </span>
                    <span 
                      id={`alternativa-${alternativa.id}-status`} 
                      className="sr-only"
                    >
                      {statusMessage}
                    </span>
                    {isUserSelected && !isCorrectOption && (
                      <span className="text-xs text-red-600 mt-1">
                        Você selecionou esta opção incorreta
                      </span>
                    )}
                    {!isUserSelected && isCorrectOption && (
                      <span className="text-xs text-yellow-600 mt-1">
                        Esta era uma resposta correta
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mt-4">
          <h4 className="font-medium text-gray-700" id={`questao-${questao.id}-explicacao`}>Explicação:</h4>
          <div 
            className="p-3 bg-blue-50 rounded-md border border-blue-100 text-gray-700"
            aria-labelledby={`questao-${questao.id}-explicacao`}
          >
            {questao.explicacao || "Nenhuma explicação disponível para esta questão."}
          </div>
        </div>
        
        {questao.referencia_ativa && questao.url_referencia && (
          <div className="mt-4">
            <a
              href={questao.url_referencia.startsWith('http') ? questao.url_referencia : `https://${questao.url_referencia}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              title="Ver referência da questão"
              tabIndex={0}
              role="link"
              aria-label="Abrir referência da questão em nova aba"
              style={{ pointerEvents: 'auto' }}
            >
              <AlertCircle className="w-5 h-5 text-white" aria-hidden="true" />
              Referência
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimuladoReviewCard;
