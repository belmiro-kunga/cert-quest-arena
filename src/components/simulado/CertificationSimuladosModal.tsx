import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Award, ArrowRight } from 'lucide-react';
import { simuladoService } from '@/services/simuladoService.js';
import type { Simulado } from '@/types/simuladoService';
import { Skeleton } from '@/components/ui/skeleton';

interface CertificationSimuladosModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

const CertificationSimuladosModal: React.FC<CertificationSimuladosModalProps> = ({
  isOpen,
  onClose,
  category
}) => {
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Obter o título da categoria
  const getCategoryTitle = (category: string): string => {
    const categoryTitles: Record<string, string> = {
      'aws': 'Certificações AWS',
      'azure': 'Certificações Microsoft Azure',
      'google-cloud': 'Certificações Google Cloud',
      'comptia': 'Certificações CompTIA',
      'cisco': 'Certificações Cisco'
    };
    
    return categoryTitles[category.toLowerCase()] || category;
  };
  
  // Renderizar o badge de categoria
  const renderCategoryBadge = (category: string) => {
    if (!category) return null;
    
    const categoryMap: Record<string, { color: string, label: string }> = {
      'aws': { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'AWS' },
      'azure': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Microsoft Azure' },
      'google-cloud': { color: 'bg-red-100 text-red-800 border-red-200', label: 'Google Cloud' },
      'comptia': { color: 'bg-green-100 text-green-800 border-green-200', label: 'CompTIA' },
      'cisco': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Cisco' }
    };
    
    const { color, label } = categoryMap[category.toLowerCase()] || 
      { color: 'bg-gray-100 text-gray-800 border-gray-200', label: category };
    
    return (
      <Badge className={`${color} border rounded-full px-2 py-1 text-xs font-medium shadow-sm select-none`}>
        {label}
      </Badge>
    );
  };
  
  // Função para verificar se um simulado corresponde a uma categoria
  const matchesCategory = (simulado: Simulado, categoryFilter: string): boolean => {
    if (!categoryFilter) return true;
    
    // Obter a categoria do simulado
    const simuladoCategory = simulado.category.toLowerCase();
    const filter = categoryFilter.toLowerCase();
    
    // Mapeamento de termos relacionados para melhorar a correspondência
    const categoryMappings: Record<string, string[]> = {
      'aws': ['aws', 'amazon', 'amazon web services'],
      'azure': ['azure', 'microsoft azure', 'microsoft', 'az-'],
      'google-cloud': ['gcp', 'google cloud', 'google'],
      'comptia': ['comptia', 'comp tia', 'a+', 'network+', 'security+'],
      'cisco': ['cisco', 'ccna', 'ccnp']
    };
    
    // Verificar se o filtro tem mapeamentos especiais
    const filterTerms = categoryMappings[filter] || [filter];
    
    // Verificar se a categoria do simulado contém algum dos termos mapeados
    return filterTerms.some(term => 
      simuladoCategory.includes(term) || 
      simulado.title.toLowerCase().includes(term)
    );
  };
  
  // Carregar simulados quando o modal abrir
  useEffect(() => {
    const loadSimulados = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const data = await simuladoService.getActiveSimulados();
        
        // Processar os simulados para garantir que tenham campos de categoria consistentes
        const processedData = data.map(simulado => ({
          ...simulado,
          // Garantir que o campo categoria esteja definido
          category: simulado.category || ''
        }));
        
        // Filtrar por categoria e idioma preferido
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 'pt';
        const filteredSimulados = processedData.filter(s => 
          s.language === preferredLanguage && 
          matchesCategory(s, category)
        );
        
        // Limitar a 5 simulados para o modal
        setSimulados(filteredSimulados.slice(0, 5));
      } catch (error) {
        console.error('Erro ao carregar simulados para o modal:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSimulados();
  }, [isOpen, category]);
  
  // Navegar para a página de detalhes do simulado
  const handleSimuladoClick = (simuladoId: string) => {
    onClose();
    navigate(`/simulados/${simuladoId}`);
  };
  
  // Navegar para a página de simulados filtrada
  const handleViewAllClick = () => {
    onClose();
    navigate(`/simulados?categoria=${category}`);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {renderCategoryBadge(category)}
            <span>{getCategoryTitle(category)}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            // Esqueletos de carregamento
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : simulados.length > 0 ? (
            // Lista de simulados
            <div className="space-y-3">
              {simulados.map((simulado) => (
                <div 
                  key={simulado.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSimuladoClick(simulado.id)}
                >
                  <h3 className="font-medium text-gray-900">{simulado.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{simulado.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{simulado.questions_count || simulado.total_questions || 0} questões</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      <span>{simulado.difficulty || 'medium'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Mensagem de nenhum simulado encontrado
            <div className="text-center py-6">
              <p className="text-gray-500">Nenhum simulado disponível para esta categoria.</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={handleViewAllClick} className="gap-1">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificationSimuladosModal;
