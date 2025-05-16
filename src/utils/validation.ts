import { z } from 'zod';
import { Question } from '../types/question';

// Schema para validação de questões
export const questionSchema = z.object({
  title: z.string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(200, 'O título não pode ter mais de 200 caracteres')
    .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, 'O título contém caracteres inválidos'),
  
  description: z.string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'A descrição não pode ter mais de 1000 caracteres'),
  
  type: z.enum(['multiple_choice', 'true_false', 'drag_and_drop', 'fill_blank']),
  
  content: z.record(z.any())
    .refine((content) => {
      // Validações específicas baseadas no tipo
      switch (content.type) {
        case 'multiple_choice':
          return validateMultipleChoice(content);
        case 'true_false':
          return validateTrueFalse(content);
        case 'drag_and_drop':
          return validateDragAndDrop(content);
        case 'fill_blank':
          return validateFillBlank(content);
        default:
          return false;
      }
    }, 'Conteúdo inválido para o tipo de questão')
});

// Funções de validação específicas
function validateMultipleChoice(content: any): boolean {
  return (
    Array.isArray(content.options) &&
    content.options.length >= 2 &&
    content.options.length <= 6 &&
    content.options.every((opt: any) => 
      typeof opt.text === 'string' &&
      opt.text.length > 0 &&
      typeof opt.isCorrect === 'boolean'
    ) &&
    content.options.filter((opt: any) => opt.isCorrect).length === 1
  );
}

function validateTrueFalse(content: any): boolean {
  return (
    typeof content.correctAnswer === 'boolean' &&
    typeof content.explanation === 'string' &&
    content.explanation.length > 0
  );
}

function validateDragAndDrop(content: any): boolean {
  return (
    Array.isArray(content.items) &&
    content.items.length >= 2 &&
    content.items.every((item: any) =>
      typeof item.text === 'string' &&
      item.text.length > 0 &&
      (content.type === 'ordering' || typeof item.category === 'string')
    )
  );
}

function validateFillBlank(content: any): boolean {
  return (
    typeof content.text === 'string' &&
    content.text.length > 0 &&
    Array.isArray(content.blanks) &&
    content.blanks.every((blank: any) =>
      typeof blank.correctAnswer === 'string' &&
      blank.correctAnswer.length > 0
    )
  );
}

// Função para validar dados
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map(e => e.message).join(', '));
    }
    throw error;
  }
};

// Função para sanitizar strings
export const sanitizeString = (str: string): string => {
  return str
    .replace(/[<>]/g, '') // Remove caracteres HTML
    .replace(/javascript:/gi, '') // Remove protocolos javascript
    .trim();
};

// Função para validar e sanitizar dados
export const validateAndSanitize = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  if (typeof data === 'object' && data !== null) {
    // Sanitiza strings em objetos
    Object.keys(data).forEach(key => {
      if (typeof (data as any)[key] === 'string') {
        (data as any)[key] = sanitizeString((data as any)[key]);
      }
    });
  }
  
  return validateData(schema, data);
}; 