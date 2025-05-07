import React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Question } from '@/types/admin';
import { Plus, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NetworkTopologyFieldsProps {
  form: UseFormReturn<Question>;
}

const nodeTypes = [
  {
    value: 'router',
    label: 'Roteador',
    description: 'Dispositivo de camada 3 para roteamento de pacotes',
  },
  {
    value: 'switch',
    label: 'Switch',
    description: 'Dispositivo de camada 2 para comutação de quadros',
  },
  {
    value: 'host',
    label: 'Host',
    description: 'Computador ou servidor final',
  },
  {
    value: 'firewall',
    label: 'Firewall',
    description: 'Dispositivo de segurança para controle de tráfego',
  },
  {
    value: 'cloud',
    label: 'Nuvem',
    description: 'Representa uma rede externa ou serviço em nuvem',
  },
];

const connectionTypes = [
  {
    value: 'ethernet',
    label: 'Ethernet',
    description: 'Conexão padrão Ethernet (RJ45)',
  },
  {
    value: 'serial',
    label: 'Serial',
    description: 'Conexão serial para WAN',
  },
  {
    value: 'fiber',
    label: 'Fibra',
    description: 'Conexão por fibra óptica',
  },
  {
    value: 'wireless',
    label: 'Wireless',
    description: 'Conexão sem fio (Wi-Fi)',
  },
];

export const NetworkTopologyFields: React.FC<NetworkTopologyFieldsProps> = ({ form }) => {
  const topology = form.watch('topology') || { nodes: [], connections: [] };
  const tasks = form.watch('tasks') || [];

  const addNode = () => {
    const currentTopology = form.getValues('topology') || { nodes: [], connections: [] };
    const newNode = {
      id: crypto.randomUUID(),
      type: 'router' as const,
      config: {},
    };
    
    form.setValue('topology', {
      ...currentTopology,
      nodes: [...currentTopology.nodes, newNode],
    });
  };

  const removeNode = (id: string) => {
    const currentTopology = form.getValues('topology');
    
    form.setValue('topology', {
      nodes: currentTopology.nodes.filter(node => node.id !== id),
      connections: currentTopology.connections.filter(
        conn => conn.from !== id && conn.to !== id
      ),
    });
  };

  const addConnection = () => {
    const currentTopology = form.getValues('topology') || { nodes: [], connections: [] };
    const newConnection = {
      from: '',
      to: '',
      type: 'ethernet' as const,
    };
    
    form.setValue('topology', {
      ...currentTopology,
      connections: [...currentTopology.connections, newConnection],
    });
  };

  const removeConnection = (index: number) => {
    const currentTopology = form.getValues('topology');
    form.setValue('topology', {
      ...currentTopology,
      connections: currentTopology.connections.filter((_, i) => i !== index),
    });
  };

  const addTask = () => {
    const currentTasks = form.getValues('tasks') || [];
    form.setValue('tasks', [
      ...currentTasks,
      {
        description: '',
        validator: '',
      }
    ]);
  };

  const removeTask = (index: number) => {
    const currentTasks = form.getValues('tasks') || [];
    form.setValue('tasks', currentTasks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Nós da Topologia */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Dispositivos</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addNode}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Dispositivo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topology.nodes?.map((node, nodeIndex) => (
              <div key={node.id} className="flex flex-col gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {nodeTypes.find(t => t.value === node.type)?.label || node.type}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeNode(node.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`topology.nodes.${nodeIndex}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {nodeTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="space-y-1">
                                  <div>{type.label}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {type.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`topology.nodes.${nodeIndex}.config`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Configuração</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Configuração em JSON..."
                            className="font-mono"
                            {...field}
                            value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value}
                            onChange={e => {
                              try {
                                const value = JSON.parse(e.target.value);
                                field.onChange(value);
                              } catch {
                                field.onChange(e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            {(!topology.nodes || topology.nodes.length === 0) && (
              <p className="text-sm text-muted-foreground">
                Adicione dispositivos à topologia
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conexões */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Conexões</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addConnection}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Conexão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topology.connections?.map((connection, connectionIndex) => (
              <div key={connectionIndex} className="flex flex-col gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {connectionTypes.find(t => t.value === connection.type)?.label || connection.type}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeConnection(connectionIndex)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`topology.connections.${connectionIndex}.from`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>De</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Dispositivo origem" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {topology.nodes?.map(node => (
                              <SelectItem key={node.id} value={node.id}>
                                {nodeTypes.find(t => t.value === node.type)?.label || node.type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`topology.connections.${connectionIndex}.to`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Para</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Dispositivo destino" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {topology.nodes?.map(node => (
                              <SelectItem key={node.id} value={node.id}>
                                {nodeTypes.find(t => t.value === node.type)?.label || node.type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`topology.connections.${connectionIndex}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de conexão" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {connectionTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="space-y-1">
                                  <div>{type.label}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {type.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            {(!topology.connections || topology.connections.length === 0) && (
              <p className="text-sm text-muted-foreground">
                Adicione conexões entre os dispositivos
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tarefas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tarefas</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTask}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Tarefa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks?.map((task, taskIndex) => (
              <div key={taskIndex} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Tarefa {taskIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(taskIndex)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`tasks.${taskIndex}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva a tarefa..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tasks.${taskIndex}.validator`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validador</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Função de validação em JavaScript..."
                          className="font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Escreva uma função que valida se a tarefa foi concluída corretamente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            {(!tasks || tasks.length === 0) && (
              <p className="text-sm text-muted-foreground">
                Adicione tarefas para o aluno completar
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
