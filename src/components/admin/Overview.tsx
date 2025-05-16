import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CreditCard, Clock, Package, PieChart } from "lucide-react";
import { getAllExams } from "@/services/adminService";
import { Exam } from "@/types/admin";
import { Skeleton } from "@/components/ui/skeleton";

export const Overview = () => {
  const [simulados, setSimulados] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimulados = async () => {
      try {
        setIsLoading(true);
        const data = await getAllExams();
        setSimulados(data as Exam[]);
      } catch (error) {
        console.error('Erro ao buscar simulados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimulados();
  }, []);

  // Função para normalizar categorias
  const normalizeCategory = (category: string): string => {
    const categoryLower = (category || '').toLowerCase().trim();
    
    if (categoryLower === '' || categoryLower === 'undefined' || categoryLower === 'null') {
      return 'Sem categoria';
    }
    
    if (categoryLower.includes('aws') || categoryLower.includes('amazon')) {
      return 'AWS';
    }
    
    if (categoryLower.includes('azure') || categoryLower.includes('microsoft') || categoryLower.includes('ms-')) {
      return 'Microsoft Azure';
    }
    
    if (categoryLower.includes('gcp') || categoryLower.includes('google') || categoryLower.includes('cloud platform')) {
      return 'Google Cloud';
    }
    
    if (categoryLower.includes('comptia') || categoryLower.includes('comp tia')) {
      return 'CompTIA';
    }
    
    if (categoryLower.includes('cisco') || categoryLower.includes('ccna') || categoryLower.includes('ccnp')) {
      return 'Cisco';
    }
    
    return category || 'Sem categoria';
  };

  // Contar simulados por categoria
  const categoryCounts = simulados.reduce((acc: Record<string, number>, simulado) => {
    // Obter a categoria do simulado e normalizá-la
    const categoria = normalizeCategory(simulado.categoria || simulado.category || '');
    
    // Adicionar à contagem
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {});

  // Função para obter a cor baseada na categoria
  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      'aws': 'bg-orange-500',
      'microsoft azure': 'bg-blue-500',
      'google cloud': 'bg-red-500',
      'comptia': 'bg-green-500',
      'cisco': 'bg-indigo-500',
      'sem categoria': 'bg-gray-500'
    };
    
    const categoryKey = category.toLowerCase();
    return colorMap[categoryKey] || 'bg-gray-500';
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Alunos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              +2 desde o último mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Simulados Ativos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{simulados.length}</div>
                <p className="text-xs text-muted-foreground">
                  {simulados.filter(s => s.is_gratis).length} simulados gratuitos
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pacotes Ativos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Combinações de simulados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas do Mês
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,430</div>
            <p className="text-xs text-muted-foreground">
              +20% comparado ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas de Simulados por Categoria */}
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              Distribuição de Simulados por Categoria
            </CardTitle>
            <CardDescription>
              Quantidade de simulados disponíveis em cada categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(categoryCounts).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum simulado cadastrado
                  </p>
                ) : (
                  Object.entries(categoryCounts).map(([category, count]) => (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category}</span>
                        <span className="text-muted-foreground">{count} simulados</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getCategoryColor(category)}`} 
                          style={{ width: `${(count / simulados.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
