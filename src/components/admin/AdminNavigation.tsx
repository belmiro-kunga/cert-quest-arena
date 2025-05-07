
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AdminNavigation({ activeTab, onTabChange }: AdminNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="admin-tabs mb-4">
        <TabsTrigger value="overview" className="admin-tab">Visão Geral</TabsTrigger>
        <TabsTrigger value="students" className="admin-tab">Alunos</TabsTrigger>
        <TabsTrigger value="exams" className="admin-tab">Simulados</TabsTrigger>
        <TabsTrigger value="questions" className="admin-tab">Questões</TabsTrigger>
        <TabsTrigger value="content" className="admin-tab">Conteúdo</TabsTrigger>
        <TabsTrigger value="coupons" className="admin-tab">Cupons</TabsTrigger>
        <TabsTrigger value="study" className="admin-tab">Sistema de Estudos</TabsTrigger>
        <TabsTrigger value="gamification" className="admin-tab">Gamificação</TabsTrigger>
        <TabsTrigger value="achievements" className="admin-tab">Conquistas</TabsTrigger>
        <TabsTrigger value="payments" className="admin-tab">Pagamentos</TabsTrigger>
        <TabsTrigger value="settings" className="admin-tab">Configurações</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
