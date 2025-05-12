# Exemplo de Implementação - URL de Referência para Questões

## Visão Geral
Este documento demonstra como a funcionalidade de URL de referência deve funcionar na página de resultados do simulado.

## Exemplo de Questão no Banco de Dados

```json
{
  "id": 123,
  "simulado_id": 45,
  "texto": "Qual serviço da AWS é usado para criar redes virtuais isoladas?",
  "tipo": "single_choice",
  "explicacao": "O Amazon VPC (Virtual Private Cloud) permite que você provisione uma seção logicamente isolada da Nuvem AWS onde você pode lançar recursos da AWS em uma rede virtual que você definiu.",
  "url_referencia": "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html",
  "opcoes": [
    {
      "id": 1,
      "texto": "Amazon EC2",
      "correta": false
    },
    {
      "id": 2,
      "texto": "Amazon VPC",
      "correta": true
    },
    {
      "id": 3,
      "texto": "Amazon S3",
      "correta": false
    },
    {
      "id": 4,
      "texto": "Amazon RDS",
      "correta": false
    }
  ]
}
```

## Como Aparece na Interface

Na página de resultados do simulado, a seção de explicação para esta questão deve mostrar:

1. Um ícone azul clicável (AlertCircle) ao lado da palavra "Explicação:"
2. O texto da explicação: "O Amazon VPC (Virtual Private Cloud) permite que você provisione uma seção logicamente isolada da Nuvem AWS onde você pode lançar recursos da AWS em uma rede virtual que você definiu."
3. Um link "Ver documentação oficial" no final da explicação

Quando o usuário clica no ícone ou no link "Ver documentação oficial", o navegador abre uma nova aba com a URL: https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html

## Implementação no Backend

Para implementar esta funcionalidade, você precisa:

1. Adicionar o campo `url_referencia` na tabela de questões no banco de dados
2. Atualizar as APIs do backend para incluir este campo nas respostas
3. Preencher este campo com URLs relevantes para cada questão

## Exemplo de SQL para Atualizar o Banco de Dados

```sql
-- Adicionar coluna url_referencia à tabela de questões (se ainda não existir)
ALTER TABLE questoes ADD COLUMN url_referencia VARCHAR(255);

-- Atualizar algumas questões com URLs de referência
UPDATE questoes 
SET url_referencia = 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html' 
WHERE id = 123;

UPDATE questoes 
SET url_referencia = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html' 
WHERE id = 124;
```

## Observações

- Se uma questão não tiver URL de referência, o ícone aparecerá em cinza e não será clicável
- O link "Ver documentação oficial" só aparecerá se houver uma URL de referência
- As URLs devem apontar para documentação oficial ou recursos confiáveis relacionados ao tópico da questão
