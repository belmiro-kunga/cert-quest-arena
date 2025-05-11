import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, DollarSign, LineChart, TrendingUp, Users } from 'lucide-react';

// Dados mockados para exemplo
const mockData = {
  dailyRevenue: {
    USD: 1250.50,
    EUR: 1150.75
  },
  monthlyRevenue: {
    USD: 28500.00,
    EUR: 26200.00
  },
  topProducts: [
    { name: 'AWS Certification', sales: 45, revenue: { USD: 4500, EUR: 4140 } },
    { name: 'Azure Fundamentals', sales: 38, revenue: { USD: 3800, EUR: 3496 } },
    { name: 'Google Cloud Associate', sales: 32, revenue: { USD: 3200, EUR: 2944 } }
  ],
  affiliateStats: {
    totalAffiliates: 125,
    activeAffiliates: 85,
    commissionsUSD: 2850.00,
    commissionsEUR: 2622.00
  },
  conversionRate: 3.2, // %
  averageOrderValue: {
    USD: 125.50,
    EUR: 115.46
  }
};

const SalesMetrics = () => {
  const [timeRange, setTimeRange] = React.useState('7d');
  const [currency, setCurrency] = React.useState('USD');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Métricas de Vendas</h2>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Moeda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Receita Diária */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Diária</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockData.dailyRevenue[currency as keyof typeof mockData.dailyRevenue])}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação a ontem
            </p>
          </CardContent>
        </Card>

        {/* Receita Mensal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockData.monthlyRevenue[currency as keyof typeof mockData.monthlyRevenue])}
            </div>
            <p className="text-xs text-muted-foreground">
              +15.3% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Taxa de Conversão */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.conversionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.4% em relação à semana anterior
            </p>
          </CardContent>
        </Card>

        {/* Ticket Médio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockData.averageOrderValue[currency as keyof typeof mockData.averageOrderValue])}
            </div>
            <p className="text-xs text-muted-foreground">
              +5.2% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Produtos Mais Vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Top 3 produtos por receita</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} vendas</p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(product.revenue[currency as keyof typeof product.revenue])}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métricas de Afiliados */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Afiliados</CardTitle>
            <CardDescription>Desempenho do programa de afiliados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total de Afiliados</p>
                  <p className="text-xs text-muted-foreground">Ativos: {mockData.affiliateStats.activeAffiliates}</p>
                </div>
                <div className="text-2xl font-bold">{mockData.affiliateStats.totalAffiliates}</div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Comissões Pagas</p>
                <div className="text-sm font-medium">
                  {formatCurrency(mockData.affiliateStats[`commissions${currency}` as keyof typeof mockData.affiliateStats])}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Taxa de Ativação</p>
                <div className="text-sm font-medium">
                  {Math.round((mockData.affiliateStats.activeAffiliates / mockData.affiliateStats.totalAffiliates) * 100)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesMetrics;
