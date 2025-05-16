import { api } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalExams: number;
  completedExams: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface Payment {
  id: string;
  user_id: string;
  userName?: string;
  amount: number;
  status: string;
  method: string;
  created_at: string;
  updated_at?: string;
  transaction_id?: string;
  order_id?: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  totalQuestions: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dados simulados para alunos/usuários
const mockStudents = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    provider: 'email',
    plan_type: 'free',
    attempts_left: 2,
    progress: 80,
    achievements: 3,
    lastActive: '2023-06-01T12:00:00Z',
    exams: ['1', '2'],
    created_at: '2023-01-10T09:00:00Z',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    provider: 'google',
    plan_type: 'premium',
    attempts_left: 5,
    progress: 100,
    achievements: 5,
    lastActive: '2023-06-02T14:30:00Z',
    exams: ['3'],
    created_at: '2023-02-15T10:30:00Z',
  },
  {
    id: '3',
    name: 'Carlos Souza',
    email: 'carlos.souza@email.com',
    provider: 'github',
    plan_type: 'basic',
    attempts_left: 1,
    progress: 0,
    achievements: 0,
    lastActive: '2023-05-30T08:15:00Z',
    exams: [],
    created_at: '2023-03-20T11:45:00Z',
  },
  {
    id: '4',
    name: 'Ana Paula',
    email: 'ana.paula@email.com',
    provider: 'email',
    plan_type: 'premium',
    attempts_left: 3,
    progress: 60,
    achievements: 2,
    lastActive: '2023-06-03T16:40:00Z',
    exams: ['4', '5'],
    created_at: '2023-04-05T13:20:00Z',
  },
  {
    id: '5',
    name: 'Pedro Santos',
    email: 'pedro.santos@email.com',
    provider: 'email',
    plan_type: 'free',
    attempts_left: 0,
    progress: 10,
    achievements: 1,
    lastActive: '2023-06-04T18:25:00Z',
    exams: ['6'],
    created_at: '2023-05-12T15:10:00Z',
  }
];

export const getUsers = async (): Promise<any[]> => {
  // Sempre retorna os dados mockados para teste
  return mockStudents;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/admin/users/${userId}`);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};

export const getStats = async (): Promise<AdminStats> => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};

export const getSystemLogs = async (page: number = 1, limit: number = 50): Promise<any[]> => {
  try {
    const response = await api.get('/admin/logs', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar logs do sistema:', error);
    return [];
  }
};

export const getErrorLogs = async (page: number = 1, limit: number = 50): Promise<any[]> => {
  try {
    const response = await api.get('/admin/error-logs', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar logs de erro:', error);
    return [];
  }
};

export const clearLogs = async (): Promise<void> => {
  try {
    await api.delete('/admin/logs');
  } catch (error) {
    console.error('Erro ao limpar logs:', error);
    throw error;
  }
};

export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    const response = await api.get('/admin/payments');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    return [];
  }
};

export const fetchLanguages = async (): Promise<Language[]> => {
  try {
    const response = await api.get('/admin/languages');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar idiomas:', error);
    return [];
  }
};

export const createLanguage = async (language: Language): Promise<Language> => {
  try {
    const response = await api.post('/admin/languages', language);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar idioma:', error);
    throw error;
  }
};

export const updateLanguage = async (language: Language): Promise<Language> => {
  try {
    const response = await api.put(`/admin/languages/${language.code}`, language);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar idioma:', error);
    throw error;
  }
};

export const deleteLanguage = async (code: string): Promise<void> => {
  try {
    await api.delete(`/admin/languages/${code}`);
  } catch (error) {
    console.error('Erro ao deletar idioma:', error);
    throw error;
  }
};

// Dados simulados para exames
const mockExams = [
  {
    id: "1",
    titulo: "AWS Certified Solutions Architect",
    descricao: "Prepare-se para a certificação AWS Solutions Architect",
    preco: 49.99,
    preco_usd: 49.99,
    is_gratis: false,
    nivel_dificuldade: "Intermediário",
    duracao_minutos: 120,
    quantidade_questoes: 65,
    categoria: "AWS",
    created_at: "2023-01-15T10:30:00Z",
    updated_at: "2023-05-20T14:45:00Z"
  },
  {
    id: "2",
    titulo: "AWS Certified Developer",
    descricao: "Certificação para desenvolvedores AWS",
    preco: 39.99,
    preco_usd: 39.99,
    is_gratis: false,
    nivel_dificuldade: "Intermediário",
    duracao_minutos: 90,
    quantidade_questoes: 50,
    categoria: "AWS",
    created_at: "2023-02-10T09:15:00Z",
    updated_at: "2023-06-05T11:20:00Z"
  },
  {
    id: "3",
    titulo: "Microsoft Azure Administrator",
    descricao: "Prepare-se para a certificação Azure Administrator",
    preco: 44.99,
    preco_usd: 44.99,
    is_gratis: false,
    nivel_dificuldade: "Intermediário",
    duracao_minutos: 100,
    quantidade_questoes: 60,
    categoria: "Microsoft Azure",
    created_at: "2023-03-05T13:45:00Z",
    updated_at: "2023-07-12T10:30:00Z"
  },
  {
    id: "4",
    titulo: "Google Cloud Associate Engineer",
    descricao: "Certificação para engenheiros GCP",
    preco: 0,
    preco_usd: 0,
    is_gratis: true,
    nivel_dificuldade: "Básico",
    duracao_minutos: 60,
    quantidade_questoes: 40,
    categoria: "Google Cloud",
    created_at: "2023-04-20T15:30:00Z",
    updated_at: "2023-08-18T09:45:00Z"
  },
  {
    id: "5",
    titulo: "CompTIA Security+",
    descricao: "Certificação em segurança de TI",
    preco: 59.99,
    preco_usd: 59.99,
    is_gratis: false,
    nivel_dificuldade: "Avançado",
    duracao_minutos: 150,
    quantidade_questoes: 90,
    categoria: "CompTIA",
    created_at: "2023-05-15T11:20:00Z",
    updated_at: "2023-09-22T14:15:00Z"
  },
  {
    id: "6",
    titulo: "Cisco CCNA",
    descricao: "Certificação Cisco CCNA",
    preco: 0,
    preco_usd: 0,
    is_gratis: true,
    nivel_dificuldade: "Intermediário",
    duracao_minutos: 120,
    quantidade_questoes: 70,
    categoria: "Cisco",
    created_at: "2023-06-10T08:45:00Z",
    updated_at: "2023-10-05T16:30:00Z"
  }
];

export const getAllExams = async (): Promise<Exam[]> => {
  // Sempre retorna os dados mockados para teste
  return mockExams.map((simulado) => ({
    id: String(simulado.id || ''),
    title: simulado.titulo || '',
    description: simulado.descricao || '',
    price: simulado.preco || 0,
    preco_usd: simulado.preco_usd || 0,
    is_gratis: simulado.is_gratis === true,
    difficulty: simulado.nivel_dificuldade || '',
    duration: simulado.duracao_minutos || 60,
    questions_count: simulado.quantidade_questoes || 0,
    category: simulado.categoria || '',
    categoria: simulado.categoria || '',
    created_at: simulado.created_at || new Date().toISOString(),
    updated_at: simulado.updated_at || new Date().toISOString(),
    totalQuestions: simulado.quantidade_questoes || 0,
    isActive: true,
    createdAt: simulado.created_at || new Date().toISOString(),
    updatedAt: simulado.updated_at || new Date().toISOString()
  }));
};
