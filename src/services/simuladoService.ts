/**
 * Serviço para interagir com a API de simulados
 */

import axios from 'axios';

// Defina a URL base da API
const API_URL = 'http://localhost:3001/api';

// Interface para o tipo Simulado
export interface Simulado {
  id?: number;
  titulo: string;
  descricao?: string;
  is_gratis?: boolean;
  preco?: number;
  preco_desconto?: number | null;
  porcentagem_desconto?: number | null;
  desconto_expira_em?: string | null;
  quantidade_questoes?: number;
  duracao_minutos: number;
  nivel_dificuldade?: string;
  nota_minima?: number;
  data_criacao?: string;
  ativo?: boolean;
  language?: string; // Novo campo para idioma
  preco_brl?: number; // Preço em reais
  preco_usd?: number; // Preço em dólar
  topicos?: string[]; // Tópicos abordados
  categoria?: string; // Categoria do simulado (AWS, Azure, GCP, etc.)
  is_subscription?: boolean;
  subscription_duration?: number;
  subscription_price?: number;
  subscription_currency?: string;
}

// Interface para mapear entre o tipo Exam do frontend e o tipo Simulado do backend
export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  preco_usd?: number;
  language: string;
  difficulty: string;
  duration: number;
  questions_count: number;
  category: string;
  categoria?: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  topicos?: string[];
  is_gratis?: boolean;
  is_subscription?: boolean;
  subscription_duration?: number;
  subscription_price?: number;
  subscription_currency?: string;
}

// Função para converter Simulado (backend) para Exam (frontend)
export const simuladoToExam = (simulado: Simulado): Exam => {
  // Log para depuração
  console.log('Convertendo simulado:', simulado);
  
  // Garantir que todos os campos obrigatórios tenham valores padrão
  const exam = {
    id: String(simulado.id || 0),
    title: simulado.title || simulado.titulo || 'Sem título',
    description: simulado.description || simulado.descricao || '',
    price: typeof simulado.preco === 'number' ? simulado.preco : (simulado.preco ? parseFloat(simulado.preco) : (simulado.price || 0)),
    discountPrice: simulado.preco_desconto ? parseFloat(String(simulado.preco_desconto)) : (simulado.discountPrice ? parseFloat(String(simulado.discountPrice)) : undefined),
    language: simulado.language || 'pt',
    difficulty: simulado.difficulty || simulado.nivel_dificuldade || 'Médio',
    duration: simulado.duracao_minutos || simulado.duration || 60,
    questions_count: simulado.questions_count || simulado.quantidade_questoes || 0,
    category: simulado.category || simulado.categoria || '',
    categoria: simulado.categoria || simulado.category || '',
    image_url: simulado.image_url || '',
    created_at: simulado.data_criacao || simulado.created_at || '',
    updated_at: simulado.data_atualizacao || simulado.updated_at || '',
    topicos: simulado.topicos || [],
    is_subscription: simulado.is_subscription || false,
    subscription_duration: simulado.subscription_duration || 90,
    subscription_price: simulado.subscription_price,
    subscription_currency: simulado.subscription_currency || 'BRL',
    is_gratis: simulado.is_gratis === true
  };
  
  // Log para depuração
  console.log('Exam convertido:', exam);
  
  return exam;
};

// Função para converter Exam (frontend) para Simulado (backend)
export const examToSimulado = (exam: Exam): Simulado => {
  return {
    id: exam.id ? Number(exam.id) : undefined,
    titulo: exam.title,
    descricao: exam.description,
    preco: exam.preco_usd ?? exam.price,
    preco_usd: exam.preco_usd,
    preco_desconto: exam.discountPrice,
    language: exam.language || 'pt',
    nivel_dificuldade: exam.difficulty,
    duracao_minutos: exam.duration,
    quantidade_questoes: exam.questions_count,
    data_criacao: exam.created_at,
    ativo: true,
    topicos: exam.topicos || [],
    categoria: exam.categoria || exam.category || 'aws',
    is_gratis: exam.is_gratis,
    is_subscription: exam.is_subscription,
    subscription_duration: exam.subscription_duration,
    subscription_price: exam.subscription_price,
    subscription_currency: exam.subscription_currency
  };
};

/**
 * Busca todos os simulados e converte para o formato Exam
 */
export const getExams = async (): Promise<Exam[]> => {
  try {
    const response = await axios.get(`${API_URL}/simulados`);
    return response.data.map(simuladoToExam);
  } catch (error) {
    console.error('Erro ao buscar simulados:', error);
    throw error;
  }
};

/**
 * Busca todos os simulados no formato original
 */
export const getSimulados = async (): Promise<Simulado[]> => {
  try {
    const response = await axios.get(`${API_URL}/simulados`);
    // Garante que todos os campos relevantes estão presentes
    return response.data.map((simulado: any) => ({
      id: simulado.id,
      titulo: simulado.titulo || simulado.title || '',
      descricao: simulado.descricao || simulado.description || '',
      is_gratis: simulado.is_gratis === true, // sempre booleano
      preco: simulado.preco || simulado.price,
      preco_desconto: simulado.preco_desconto || simulado.discountPrice,
      porcentagem_desconto: simulado.porcentagem_desconto,
      desconto_expira_em: simulado.desconto_expira_em,
      quantidade_questoes: simulado.quantidade_questoes || simulado.questions_count,
      duracao_minutos: simulado.duracao_minutos || simulado.duration,
      nivel_dificuldade: simulado.nivel_dificuldade || simulado.difficulty || '',
      nota_minima: simulado.nota_minima,
      data_criacao: simulado.data_criacao || simulado.created_at || '',
      ativo: simulado.ativo !== undefined ? simulado.ativo : (simulado.status !== undefined ? simulado.status : true),
      language: simulado.language,
      is_subscription: simulado.is_subscription,
      subscription_duration: simulado.subscription_duration,
      subscription_price: simulado.subscription_price,
      subscription_currency: simulado.subscription_currency
    }));
  } catch (error) {
    console.error('Erro ao buscar simulados:', error);
    throw error;
  }
};

/**
 * Busca um simulado pelo ID e converte para o formato Exam
 */
export const getExamById = async (id: string): Promise<Exam> => {
  try {
    const response = await axios.get(`${API_URL}/simulados/${id}`);
    return simuladoToExam(response.data);
  } catch (error) {
    console.error(`Erro ao buscar simulado com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Busca um simulado pelo ID e converte para o formato Exam
 */
export const getSimuladoById = async (id: number): Promise<Exam> => {
  try {
    console.log(`Buscando simulado com ID ${id}...`);
    const response = await axios.get(`${API_URL}/simulados/${id}`);
    console.log('Resposta da API:', response.data);
    
    if (!response.data) {
      throw new Error(`Simulado com ID ${id} não encontrado`);
    }
    
    return simuladoToExam(response.data);
  } catch (error) {
    console.error(`Erro ao buscar simulado com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Cria um novo exame (converte de Exam para Simulado e depois cria)
 */
export const createExam = async (exam: Exam): Promise<Exam> => {
  console.log('Enviando dados para criar exame:', exam);
  try {
    // Converter para o formato do backend
    const simulado = examToSimulado(exam);
    console.log('Dados convertidos para formato do backend:', simulado);
    
    const response = await axios.post(`${API_URL}/simulados`, simulado);
    console.log('Resposta do servidor:', response.data);
    return simuladoToExam(response.data);
  } catch (error: any) {
    console.error('Erro ao criar exame:', error);
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Resposta de erro do servidor:', error.response.data);
      console.error('Status do erro:', error.response.status);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor. Verifique se o backend está rodando.');
    } else {
      // Algo aconteceu na configuração da requisição que causou o erro
      console.error('Erro na configuração da requisição:', error.message);
    }
    throw error;
  }
};

/**
 * Cria um novo simulado no formato original
 */
export const createSimulado = async (simulado: Simulado): Promise<Simulado> => {
  console.log('Enviando dados para criar simulado:', simulado);
  try {
    // Garantir que duracao_minutos seja um número
    const dadosParaEnviar = {
      ...simulado,
      duracao_minutos: Number(simulado.duracao_minutos),
      is_gratis: !!simulado.is_gratis // força booleano
    };
    
    console.log('Dados formatados para envio:', dadosParaEnviar);
    
    const response = await axios.post(`${API_URL}/simulados`, dadosParaEnviar);
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar simulado:', error);
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Resposta de erro do servidor:', error.response.data);
      console.error('Status do erro:', error.response.status);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor. Verifique se o backend está rodando.');
    } else {
      // Algo aconteceu na configuração da requisição que causou o erro
      console.error('Erro na configuração da requisição:', error.message);
    }
    throw error;
  }
};

/**
 * Atualiza um exame existente (converte de Exam para Simulado e depois atualiza)
 */
export const updateExam = async (id: string, exam: Exam): Promise<Exam> => {
  try {
    // Converter para o formato do backend
    const simulado = examToSimulado(exam);
    console.log(`Atualizando exame com ID ${id}:`, simulado);
    
    const response = await axios.put(`${API_URL}/simulados/${id}`, simulado);
    return simuladoToExam(response.data);
  } catch (error) {
    console.error(`Erro ao atualizar exame com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Atualiza um simulado existente no formato original
 */
export const updateSimulado = async (id: number, simulado: Simulado): Promise<Simulado> => {
  try {
    const dadosParaEnviar = {
      ...simulado,
      is_gratis: !!simulado.is_gratis // força booleano
    };
    const response = await axios.put(`${API_URL}/simulados/${id}`, dadosParaEnviar);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar simulado com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deleta um exame
 */
export const deleteExam = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/simulados/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar exame com ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deleta um simulado
 */
export const deleteSimulado = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/simulados/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir simulado ${id}:`, error);
    throw error;
  }
};

// Dados de fallback para simulados quando a API estiver indisponível
const fallbackExams: Exam[] = [
  {
    id: 'aws-saa-01',
    title: 'AWS Certified Solutions Architect - Associate (SAA-C03)',
    description: 'Prepare-se para o exame AWS Certified Solutions Architect - Associate com este simulado completo que cobre todos os domínios do exame oficial.',
    price: 79.90,
    discountPrice: 59.90,
    preco_usd: 15.99,
    language: 'pt',
    difficulty: 'Intermediário',
    duration: 130,
    questions_count: 65,
    category: 'aws',
    categoria: 'aws',
    image_url: 'https://certquestarena.com/images/aws-saa.jpg',
    created_at: '2023-10-15T14:30:00Z',
    updated_at: '2024-03-20T09:15:00Z',
    topicos: ['EC2', 'S3', 'VPC', 'RDS', 'Lambda'],
    is_gratis: false,
    is_subscription: false,
    subscription_duration: 0,
    subscription_price: 0,
    subscription_currency: 'BRL'
  },
  {
    id: 'aws-dev-01',
    title: 'AWS Certified Developer - Associate (DVA-C02)',
    description: 'Domine os conceitos de desenvolvimento na AWS com este simulado abrangente para a certificação Developer Associate.',
    price: 69.90,
    discountPrice: 49.90,
    preco_usd: 12.99,
    language: 'pt',
    difficulty: 'Intermediário',
    duration: 120,
    questions_count: 60,
    category: 'aws',
    categoria: 'aws',
    image_url: 'https://certquestarena.com/images/aws-dev.jpg',
    created_at: '2023-11-05T10:20:00Z',
    updated_at: '2024-02-18T16:45:00Z',
    topicos: ['Lambda', 'DynamoDB', 'API Gateway', 'CloudFormation', 'CodePipeline'],
    is_gratis: false,
    is_subscription: false,
    subscription_duration: 0,
    subscription_price: 0,
    subscription_currency: 'BRL'
  },
  {
    id: 'azure-admin-01',
    title: 'Microsoft Azure Administrator (AZ-104)',
    description: 'Simulado completo para o exame Microsoft Azure Administrator, cobrindo todos os aspectos da administração de recursos Azure.',
    price: 69.90,
    discountPrice: 49.90,
    preco_usd: 12.99,
    language: 'pt',
    difficulty: 'Intermediário',
    duration: 120,
    questions_count: 60,
    category: 'azure',
    categoria: 'azure',
    image_url: 'https://certquestarena.com/images/azure-admin.jpg',
    created_at: '2023-09-10T08:15:00Z',
    updated_at: '2024-04-05T11:30:00Z',
    topicos: ['Virtual Machines', 'Storage', 'Virtual Networks', 'Identity', 'Governance'],
    is_gratis: false,
    is_subscription: false,
    subscription_duration: 0,
    subscription_price: 0,
    subscription_currency: 'BRL'
  },
  {
    id: 'comptia-sec-01',
    title: 'CompTIA Security+ (SY0-601)',
    description: 'Prepare-se para o exame CompTIA Security+ com este simulado que aborda todos os objetivos da prova oficial.',
    price: 59.90,
    discountPrice: 39.90,
    preco_usd: 9.99,
    language: 'pt',
    difficulty: 'Intermediário',
    duration: 90,
    questions_count: 90,
    category: 'comptia',
    categoria: 'comptia',
    image_url: 'https://certquestarena.com/images/comptia-sec.jpg',
    created_at: '2023-08-20T14:00:00Z',
    updated_at: '2024-01-15T09:45:00Z',
    topicos: ['Threats', 'Cryptography', 'Identity Management', 'Network Security', 'Compliance'],
    is_gratis: false,
    is_subscription: false,
    subscription_duration: 0,
    subscription_price: 0,
    subscription_currency: 'BRL'
  },
  {
    id: 'gcp-ace-01',
    title: 'Google Cloud Associate Cloud Engineer',
    description: 'Simulado completo para o exame Google Cloud Associate Cloud Engineer, abordando os principais serviços e conceitos do GCP.',
    price: 69.90,
    discountPrice: 49.90,
    preco_usd: 12.99,
    language: 'pt',
    difficulty: 'Intermediário',
    duration: 120,
    questions_count: 60,
    category: 'google-cloud',
    categoria: 'google-cloud',
    image_url: 'https://certquestarena.com/images/gcp-ace.jpg',
    created_at: '2023-12-01T16:30:00Z',
    updated_at: '2024-03-10T13:20:00Z',
    topicos: ['Compute Engine', 'Cloud Storage', 'VPC', 'IAM', 'Kubernetes Engine'],
    is_gratis: true,
    is_subscription: false,
    subscription_duration: 0,
    subscription_price: 0,
    subscription_currency: 'BRL'
  }
];

// Busca todos os simulados ativos para os alunos
export const getActiveExams = async (): Promise<Exam[]> => {
  try {
    console.log('Chamando API para buscar simulados ativos:', `${API_URL}/simulados/ativos`);
    const response = await axios.get(`${API_URL}/simulados/ativos`);
    console.log('Resposta da API de simulados ativos:', response.data);

    if (!response.data || !Array.isArray(response.data)) {
      console.error('Resposta da API não é um array:', response.data);
      return [];
    }

    const exams = response.data.map((simulado: any) => ({
      id: String(simulado.id || ''),
      title: simulado.titulo || simulado.title || '',
      description: simulado.descricao || simulado.description || '',
      price: typeof simulado.preco === 'number' ? simulado.preco : (simulado.preco ? parseFloat(simulado.preco) : 0),
      discountPrice: simulado.preco_desconto || simulado.discountPrice,
      preco_usd: typeof simulado.preco_usd === 'number' ? simulado.preco_usd : (simulado.preco_usd ? parseFloat(simulado.preco_usd) : 0),
      language: simulado.language || 'pt',
      difficulty: simulado.nivel_dificuldade || simulado.difficulty || '',
      duration: simulado.duracao_minutos || simulado.duration || 60,
      questions_count: simulado.quantidade_questoes || simulado.questions_count || 0,
      category: simulado.categoria || '',
      categoria: simulado.categoria || '', 
      image_url: simulado.image_url || '',
      created_at: simulado.data_criacao || simulado.created_at || '',
      updated_at: simulado.data_atualizacao || simulado.updated_at || '',
      topicos: simulado.topicos || [],
      is_gratis: simulado.is_gratis === true, // Garante o campo para o frontend
      is_subscription: simulado.is_subscription,
      subscription_duration: simulado.subscription_duration,
      subscription_price: simulado.subscription_price,
      subscription_currency: simulado.subscription_currency
    }));

    console.log('Exams convertidos:', exams);
    return exams;
  } catch (error) {
    console.error('Erro ao buscar simulados ativos:', error);
    console.log('Usando dados de fallback para simulados devido a erro de rede');
    return fallbackExams;
  }
};


