
import { Question } from '../types/exam';

export const awsCloudPractitionerQuestions: Question[] = [
  {
    id: 1,
    text: "Qual dos seguintes NÃO é um modelo de preço da AWS?",
    options: [
      { id: "a", text: "Pay as you go" },
      { id: "b", text: "Save when you reserve" },
      { id: "c", text: "Pay less by using more" },
      { id: "d", text: "Pay before you use" }
    ],
    correctOptionId: "d",
    explanation: "Os três modelos de preço da AWS são: Pay as you go (pague pelo que usar), Save when you reserve (economize ao reservar) e Pay less by using more (pague menos usando mais). 'Pay before you use' não é um modelo de preço oficial da AWS."
  },
  {
    id: 2,
    text: "Qual serviço da AWS permite que você execute código sem provisionar ou gerenciar servidores?",
    options: [
      { id: "a", text: "Amazon EC2" },
      { id: "b", text: "AWS Lambda" },
      { id: "c", text: "Amazon RDS" },
      { id: "d", text: "Amazon VPC" }
    ],
    correctOptionId: "b",
    explanation: "O AWS Lambda é um serviço de computação serverless que permite executar código sem provisionar ou gerenciar servidores. O Lambda executa seu código somente quando necessário e escala automaticamente."
  },
  {
    id: 3,
    text: "Qual pilar do AWS Well-Architected Framework se concentra em evitar ou se recuperar rapidamente de falhas para atender às demandas de negócios?",
    options: [
      { id: "a", text: "Excelência operacional" },
      { id: "b", text: "Segurança" },
      { id: "c", text: "Confiabilidade" },
      { id: "d", text: "Eficiência de performance" }
    ],
    correctOptionId: "c",
    explanation: "O pilar Confiabilidade do AWS Well-Architected Framework concentra-se na capacidade de um sistema se recuperar de interrupções de infraestrutura ou serviço, adquirir recursos de computação dinamicamente para atender à demanda e mitigar problemas como configurações incorretas ou problemas de rede temporários."
  },
  {
    id: 4,
    text: "Qual serviço da AWS é projetado especificamente para armazenamento de objetos?",
    options: [
      { id: "a", text: "Amazon S3" },
      { id: "b", text: "Amazon EBS" },
      { id: "c", text: "Amazon EFS" },
      { id: "d", text: "AWS Glacier" }
    ],
    correctOptionId: "a",
    explanation: "O Amazon S3 (Simple Storage Service) é um serviço de armazenamento de objetos que oferece escalabilidade, disponibilidade de dados, segurança e performance. É projetado para armazenar e recuperar qualquer quantidade de dados de qualquer lugar."
  },
  {
    id: 5,
    text: "Qual dos seguintes é um benefício do modelo de responsabilidade compartilhada da AWS?",
    options: [
      { id: "a", text: "A AWS é responsável por toda a segurança" },
      { id: "b", text: "O cliente é responsável por toda a segurança" },
      { id: "c", text: "Divisão clara de responsabilidades de segurança entre AWS e cliente" },
      { id: "d", text: "Não há necessidade de se preocupar com a segurança" }
    ],
    correctOptionId: "c",
    explanation: "O modelo de responsabilidade compartilhada da AWS divide claramente as responsabilidades de segurança entre a AWS (segurança DA nuvem) e o cliente (segurança NA nuvem), permitindo que cada parte se concentre em suas áreas de responsabilidade."
  },
  {
    id: 6,
    text: "Qual serviço da AWS fornece um firewall virtual para controlar o tráfego de entrada e saída para instâncias EC2?",
    options: [
      { id: "a", text: "AWS WAF" },
      { id: "b", text: "Security Groups" },
      { id: "c", text: "AWS Shield" },
      { id: "d", text: "AWS GuardDuty" }
    ],
    correctOptionId: "b",
    explanation: "Os Security Groups atuam como um firewall virtual para suas instâncias EC2 para controlar o tráfego de entrada e saída. Eles operam no nível da instância e especificam quais protocolos, portas e IPs de origem/destino são permitidos."
  },
  {
    id: 7,
    text: "Qual característica da AWS Cloud ajuda os clientes a implantar sistemas em várias regiões para maior disponibilidade?",
    options: [
      { id: "a", text: "Zonas de Disponibilidade" },
      { id: "b", text: "Alta escalabilidade" },
      { id: "c", text: "Elasticidade" },
      { id: "d", text: "Global Footprint" }
    ],
    correctOptionId: "d",
    explanation: "O Global Footprint da AWS refere-se à presença global da AWS com múltiplas Regiões ao redor do mundo, permitindo que os clientes implantem aplicativos em várias localizações para maior disponibilidade e melhor experiência do usuário final."
  },
  {
    id: 8,
    text: "Qual serviço da AWS pode ser usado para distribuir conteúdo globalmente com baixa latência?",
    options: [
      { id: "a", text: "Amazon VPC" },
      { id: "b", text: "Amazon CloudFront" },
      { id: "c", text: "AWS Direct Connect" },
      { id: "d", text: "Amazon Route 53" }
    ],
    correctOptionId: "b",
    explanation: "O Amazon CloudFront é um serviço de rede de entrega de conteúdo (CDN) que distribui dados, vídeos, aplicativos e APIs aos clientes globalmente com baixa latência, altas velocidades de transferência e sem compromissos mínimos."
  },
  {
    id: 9,
    text: "Qual ferramenta da AWS ajuda a estimar os custos mensais dos serviços da AWS?",
    options: [
      { id: "a", text: "AWS Trusted Advisor" },
      { id: "b", text: "AWS Cost Explorer" },
      { id: "c", text: "AWS Pricing Calculator" },
      { id: "d", text: "AWS Budgets" }
    ],
    correctOptionId: "c",
    explanation: "A AWS Pricing Calculator é uma ferramenta web que permite estimar o custo dos serviços da AWS antes de utilizá-los, ajudando no planejamento financeiro e na tomada de decisões."
  },
  {
    id: 10,
    text: "Qual é o benefício do Auto Scaling na AWS?",
    options: [
      { id: "a", text: "Redução manual de custos" },
      { id: "b", text: "Aumento automático na segurança" },
      { id: "c", text: "Ajuste automático da capacidade com base na demanda" },
      { id: "d", text: "Melhoria automática no desempenho do banco de dados" }
    ],
    correctOptionId: "c",
    explanation: "O Auto Scaling ajusta automaticamente a capacidade de computação para manter o desempenho estável e previsível pelo menor custo possível. Ele adiciona ou remove instâncias EC2 automaticamente de acordo com as condições definidas."
  }
];
