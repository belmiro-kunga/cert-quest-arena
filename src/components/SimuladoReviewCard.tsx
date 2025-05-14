import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Questao, Alternativa } from '@/types/simulado';

interface SimuladoReviewCardProps {
  questao: Questao;
  userAnswerId?: string;
  isCorrect: boolean;
  index: number;
}

export const SimuladoReviewCard: React.FC<SimuladoReviewCardProps> = ({ questao, userAnswerId, isCorrect, index }) => {
  return (
    <Card key={questao.id} className={`shadow border ${isCorrect ? 'border-green-200 bg-green-50/60' : 'border-red-200 bg-red-50/60'} transition-all duration-200`}>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            Questão {index + 1}
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
        <div className="flex flex-col gap-2">
          <span className="text-gray-500">Sua resposta:</span>
          {questao.alternativas.map(alternativa => (
            <span
              key={alternativa.id}
              className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg ${alternativa.id === userAnswerId ? (isCorrect ? 'bg-green-100 text-green-700 font-bold' : 'bg-red-100 text-red-700 font-bold') : 'bg-gray-100 text-gray-700'}`}
            >
              {alternativa.id === userAnswerId && (isCorrect ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />)}
              {alternativa.texto}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-gray-500">Resposta correta:</span>
          {questao.alternativas.map(alternativa => (
            alternativa.id === questao.resposta_correta ? (
              <span
                key={alternativa.id}
                className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-green-100 text-green-700 font-bold"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                {alternativa.texto}
              </span>
            ) : null
          ))}
          <h4 className="font-medium">Explicação:</h4>
        </div>
        <p id={`explanation-${questao.id}`} className="text-gray-700">
          {questao.explicacao || "Nenhuma explicação disponível para esta questão."}
        </p>
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
              <AlertCircle className="w-5 h-5 text-white" />
              Referência
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimuladoReviewCard;
