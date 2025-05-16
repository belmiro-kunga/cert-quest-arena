import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Question } from '@/types/admin';
import { Plus, Trash, AlertCircle, Info, ArrowUpDown, Link } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface DragAndDropFieldsProps {
  form: UseFormReturn<Question>;
}

export const DragAndDropFields: React.FC<DragAndDropFieldsProps> = ({ form }) => {
  const [error, setError] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<'ordering' | 'matching'>('matching');
  const MAX_ITEMS = 8;
  const MIN_ITEMS = 2;

  // Observar as mudanças nos campos
  const items = form.watch('dragAndDropItems') || [];
  const categories = form.watch('dragAndDropCategories') || [];

  useEffect(() => {
    // Validações
    if (items.length < MIN_ITEMS) {
      setError(`Adicione pelo menos ${MIN_ITEMS} itens.`);
    } else if (questionType === 'matching' && categories.length < 2) {
      setError('Adicione pelo menos 2 categorias para soltar os itens.');
    } else if (items.some((item: any) => !item.text.trim())) {
      setError('Nenhum item pode estar em branco.');
    } else if (questionType === 'matching' && categories.some((cat: any) => !cat.name.trim())) {
      setError('Nenhuma categoria pode estar em branco.');
    } else if (questionType === 'matching' && items.some((item: any) => !item.category)) {
      setError('Todos os itens devem ter uma categoria correta definida.');
    } else {
      setError(null);
    }
  }, [items, categories, questionType]);

  const addItem = () => {
    if (items.length >= MAX_ITEMS) {
      setError(`Limite máximo de ${MAX_ITEMS} itens atingido.`);
      return;
    }
    const currentItems = form.getValues('dragAndDropItems') || [];
    form.setValue('dragAndDropItems', [...currentItems, { 
      text: '', 
      category: questionType === 'matching' ? '' : undefined,
      hint: '' 
    }]);
  };

  const removeItem = (indexToRemove: number) => {
    const currentItems = form.getValues('dragAndDropItems') || [];
    form.setValue('dragAndDropItems', currentItems.filter((_, i) => i !== indexToRemove));
  };

  const addCategory = () => {
    if (questionType !== 'matching') return;
    const currentCategories = form.getValues('dragAndDropCategories') || [];
    form.setValue('dragAndDropCategories', [...currentCategories, { name: '', description: '' }]);
  };

  const removeCategory = (indexToRemove: number) => {
    if (questionType !== 'matching') return;
    const currentCategories = form.getValues('dragAndDropCategories') || [];
    const currentItems = form.getValues('dragAndDropItems') || [];
    
    // Atualizar itens que apontavam para a categoria removida
    const updatedItems = currentItems.map((item: any) => ({
      ...item,
      category: item.category === currentCategories[indexToRemove].name ? '' : item.category
    }));
    
    form.setValue('dragAndDropItems', updatedItems);
    form.setValue('dragAndDropCategories', currentCategories.filter((_, i) => i !== indexToRemove));
  };

  const updateItemCategory = (itemIndex: number, categoryName: string) => {
    if (questionType !== 'matching') return;
    const currentItems = form.getValues('dragAndDropItems') || [];
    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      category: categoryName
    };
    form.setValue('dragAndDropItems', updatedItems);
  };

  const handleQuestionTypeChange = (type: 'ordering' | 'matching') => {
    setQuestionType(type);
    // Limpar categorias se mudar para ordenação
    if (type === 'ordering') {
      form.setValue('dragAndDropCategories', []);
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="info" className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Escolha entre criar uma questão de ordenação (arrastar para ordenar) ou correspondência (arrastar para categorias).
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="matching" onValueChange={(value) => handleQuestionTypeChange(value as 'ordering' | 'matching')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matching" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Correspondência
          </TabsTrigger>
          <TabsTrigger value="ordering" className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Ordenação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matching">
          {/* Seção de Categorias */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categorias para Soltar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Categorias</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCategory}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Categoria
                  </Button>
                </div>

                {categories.map((_, index: number) => (
                  <div key={`category-${index}`} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-start gap-2">
                      <FormField
                        control={form.control}
                        name={`dragAndDropCategories.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Nome da Categoria</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Categoria ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCategory(index)}
                        disabled={categories.length <= 2}
                        className="mt-8"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`dragAndDropCategories.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição da Categoria</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o propósito desta categoria..."
                              className="h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Esta descrição ajudará os alunos a entenderem o propósito da categoria
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seção de Itens para Arrastar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {questionType === 'matching' ? 'Itens para Arrastar' : 'Itens para Ordenar'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Itens</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  disabled={items.length >= MAX_ITEMS}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              {items.map((item: any, index: number) => (
                <div key={`item-${index}`} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-start gap-2">
                    <FormField
                      control={form.control}
                      name={`dragAndDropItems.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Texto do Item</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Item ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {questionType === 'matching' && (
                      <FormField
                        control={form.control}
                        name={`dragAndDropItems.${index}.category`}
                        render={({ field }) => (
                          <FormItem className="w-48">
                            <FormLabel>Categoria Correta</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                updateItemCategory(index, value);
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((cat: any, catIndex: number) => (
                                  <SelectItem key={catIndex} value={cat.name}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= MIN_ITEMS}
                      className="mt-8"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`dragAndDropItems.${index}.hint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Dica para o Aluno
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Dica opcional que será mostrada ao aluno</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Adicione uma dica para ajudar o aluno..."
                            className="h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Esta dica será mostrada ao aluno durante a resolução da questão
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {error && (
        <p className="text-sm text-red-500" role="alert">{error}</p>
      )}

      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-muted-foreground">
          {items.length === 0 ? "Adicione pelo menos dois itens" : 
          `${items.length} item(ns) adicionado(s)`}
        </p>
        {questionType === 'matching' && (
          <p className="text-sm text-muted-foreground">
            {categories.length} categoria(s) definida(s)
          </p>
        )}
      </div>
    </div>
  );
};
