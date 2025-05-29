
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Question } from '@/types/admin';
import { Plus, Trash, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DragAndDropFieldsProps {
  form: UseFormReturn<Question>;
}

export const DragAndDropFields: React.FC<DragAndDropFieldsProps> = ({ form }) => {
  const items = form.watch('items') || [];
  const dragAndDropItems = form.watch('dragAndDropItems') || [];
  const dragAndDropCategories = form.watch('dragAndDropCategories') || [];
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length < 2) {
      setError('Adicione pelo menos dois itens para arrastar e soltar.');
    } else if (dragAndDropCategories.length < 2) {
      setError('Adicione pelo menos duas categorias para arrastar e soltar.');
    } else {
      setError(null);
    }
  }, [items, dragAndDropCategories]);

  const addItem = () => {
    const currentItems = form.getValues('items') || [];
    form.setValue('items', [...currentItems, { id: '', text: '', category: '' }]);
  };

  const removeItem = (indexToRemove: number) => {
    const currentItems = form.getValues('items') || [];
    form.setValue('items', currentItems.filter((_, i) => i !== indexToRemove));
  };

  const addCategory = () => {
    const currentCategories = form.getValues('dragAndDropCategories') || [];
    form.setValue('dragAndDropCategories', [...currentCategories, { name: '', description: '' }]);
  };

  const removeCategory = (indexToRemove: number) => {
    const currentCategories = form.getValues('dragAndDropCategories') || [];
    form.setValue('dragAndDropCategories', currentCategories.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Configure os itens que podem ser arrastados e as categorias onde podem ser soltos.
        </AlertDescription>
      </Alert>

      {/* Itens para arrastar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Itens para Arrastar</FormLabel>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Item
          </Button>
        </div>

        {items.map((_, index: number) => (
          <div key={index} className="flex items-start gap-2 p-4 border rounded-lg">
            <div className="flex-1 space-y-2">
              <FormField
                control={form.control}
                name={`items.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do Item</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o texto do item" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.category`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria Correta</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da categoria onde este item deve ser solto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={items.length <= 2}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Categorias */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Categorias</FormLabel>
          <Button type="button" variant="outline" size="sm" onClick={addCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Categoria
          </Button>
        </div>

        {dragAndDropCategories.map((_, index: number) => (
          <div key={index} className="flex items-start gap-2 p-4 border rounded-lg">
            <div className="flex-1 space-y-2">
              <FormField
                control={form.control}
                name={`dragAndDropCategories.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`dragAndDropCategories.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição da categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeCategory(index)}
              disabled={dragAndDropCategories.length <= 2}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">{error}</p>
      )}
    </div>
  );
};
