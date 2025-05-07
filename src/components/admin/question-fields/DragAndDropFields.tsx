import React from 'react';
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
import { Plus, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DragAndDropFieldsProps {
  form: UseFormReturn<Question>;
}

export const DragAndDropFields: React.FC<DragAndDropFieldsProps> = ({ form }) => {
  const items = form.watch('items') || [];
  const categories = [...new Set(items.map(item => item.category))];

  const addItem = () => {
    const currentItems = form.getValues('items') || [];
    const newItem = {
      id: crypto.randomUUID(),
      text: '',
      category: '',
    };
    
    // Atualiza os itens
    form.setValue('items', [...currentItems, newItem]);

    // Garante que o array de itens existe no form
    if (!form.getValues('items')) {
      form.setValue('items', []);
    }

    // Garante que o array de correctPlacements existe no form
    if (!form.getValues('correctPlacements')) {
      form.setValue('correctPlacements', []);
    }
  };

  const removeItem = (id: string) => {
    const currentItems = form.getValues('items') || [];
    const currentPlacements = form.getValues('correctPlacements') || [];
    
    form.setValue('items', currentItems.filter(item => item.id !== id));
    form.setValue('correctPlacements', currentPlacements.filter(p => p.itemId !== id));
  };

  const updateItemCategory = (id: string, category: string) => {
    const currentItems = form.getValues('items') || [];
    const currentPlacements = form.getValues('correctPlacements') || [];
    const itemIndex = currentItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) return;

    // Atualiza a categoria do item
    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], category };
    form.setValue('items', updatedItems);

    // Atualiza o placement correto
    const placement = currentPlacements.find(p => p.itemId === id);
    if (placement) {
      const updatedPlacements = currentPlacements.map(p =>
        p.itemId === id ? { ...p, targetCategory: category } : p
      );
      form.setValue('correctPlacements', updatedPlacements);
    } else {
      form.setValue('correctPlacements', [
        ...currentPlacements,
        { itemId: id, targetCategory: category }
      ]);
    }

    // Força a atualização do formulário
    form.trigger('items');
    form.trigger('correctPlacements');
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="items"
        render={() => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Itens para Arrastar</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Lista de Itens */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 p-4 border rounded-lg">
                  <div className="flex items-start gap-2">
                    <FormField
                      control={form.control}
                      name={`items.${items.findIndex(i => i.id === item.id)}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Texto do item"
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
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`items.${items.findIndex(i => i.id === item.id)}.category`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                              category && (
                                <Badge
                                  key={category}
                                  variant={field.value === category ? "default" : "outline"}
                                  className="cursor-pointer"
                                  onClick={() => updateItemCategory(item.id, category)}
                                >
                                  {category}
                                </Badge>
                              )
                            ))}
                            <Input
                              placeholder="Nova categoria..."
                              className="w-32"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const value = (e.target as HTMLInputElement).value.trim();
                                  if (value) {
                                    updateItemCategory(item.id, value);
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Adicione itens para serem arrastados
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visualização das Categorias */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => (
                category && (
                  <div key={category} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{category}</h4>
                    <div className="space-y-2">
                      {items
                        .filter(item => item.category === category)
                        .map(item => (
                          <div key={item.id} className="text-sm text-muted-foreground">
                            {item.text || '(Sem texto)'}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )
              ))}

              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  As categorias aparecerão aqui quando você criar itens
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
