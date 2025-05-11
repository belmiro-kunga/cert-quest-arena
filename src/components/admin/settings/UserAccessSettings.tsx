import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

// Definição dos tipos de permissões
const permissionSchema = z.object({
  view: z.boolean(),
  create: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
  approve: z.boolean(),
  manage: z.boolean(),
});

// Schema para os níveis de acesso
const accessLevelSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string(),
  isDefault: z.boolean(),
  isSystem: z.boolean(),
  permissions: z.object({
    users: permissionSchema,
    courses: permissionSchema,
    certifications: permissionSchema,
    payments: permissionSchema,
    reports: permissionSchema,
    settings: permissionSchema,
  }),
});

type AccessLevel = z.infer<typeof accessLevelSchema>;

// Níveis de acesso predefinidos
const defaultAccessLevels: AccessLevel[] = [
  {
    id: 'super-admin',
    name: 'Super Administrador',
    description: 'Acesso total ao sistema',
    isDefault: false,
    isSystem: true,
    permissions: {
      users: { view: true, create: true, edit: true, delete: true, approve: true, manage: true },
      courses: { view: true, create: true, edit: true, delete: true, approve: true, manage: true },
      certifications: { view: true, create: true, edit: true, delete: true, approve: true, manage: true },
      payments: { view: true, create: true, edit: true, delete: true, approve: true, manage: true },
      reports: { view: true, create: true, edit: true, delete: true, approve: true, manage: true },
      settings: { view: true, create: true, edit: true, delete: true, approve: true, manage: true },
    },
  },
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Gerenciamento geral sem acesso a configurações críticas',
    isDefault: false,
    isSystem: true,
    permissions: {
      users: { view: true, create: true, edit: true, delete: false, approve: true, manage: true },
      courses: { view: true, create: true, edit: true, delete: true, approve: true, manage: true },
      certifications: { view: true, create: true, edit: true, delete: false, approve: true, manage: true },
      payments: { view: true, create: true, edit: true, delete: false, approve: true, manage: true },
      reports: { view: true, create: true, edit: true, delete: false, approve: true, manage: true },
      settings: { view: true, create: false, edit: false, delete: false, approve: false, manage: false },
    },
  },
  {
    id: 'instructor',
    name: 'Instrutor',
    description: 'Gerenciamento de cursos e certificações',
    isDefault: false,
    isSystem: true,
    permissions: {
      users: { view: true, create: false, edit: false, delete: false, approve: false, manage: false },
      courses: { view: true, create: true, edit: true, delete: false, approve: false, manage: true },
      certifications: { view: true, create: true, edit: true, delete: false, approve: false, manage: true },
      payments: { view: true, create: false, edit: false, delete: false, approve: false, manage: false },
      reports: { view: true, create: true, edit: false, delete: false, approve: false, manage: false },
      settings: { view: false, create: false, edit: false, delete: false, approve: false, manage: false },
    },
  },
  {
    id: 'student',
    name: 'Estudante',
    description: 'Acesso básico para alunos',
    isDefault: true,
    isSystem: true,
    permissions: {
      users: { view: false, create: false, edit: false, delete: false, approve: false, manage: false },
      courses: { view: true, create: false, edit: false, delete: false, approve: false, manage: false },
      certifications: { view: true, create: false, edit: false, delete: false, approve: false, manage: false },
      payments: { view: true, create: true, edit: false, delete: false, approve: false, manage: false },
      reports: { view: true, create: false, edit: false, delete: false, approve: false, manage: false },
      settings: { view: false, create: false, edit: false, delete: false, approve: false, manage: false },
    },
  },
];

// Módulos do sistema
const MODULES = [
  { id: 'users', name: 'Usuários' },
  { id: 'courses', name: 'Cursos' },
  { id: 'certifications', name: 'Certificações' },
  { id: 'payments', name: 'Pagamentos' },
  { id: 'reports', name: 'Relatórios' },
  { id: 'settings', name: 'Configurações' },
];

// Tipos de permissões
const PERMISSIONS = [
  { id: 'view', name: 'Visualizar' },
  { id: 'create', name: 'Criar' },
  { id: 'edit', name: 'Editar' },
  { id: 'delete', name: 'Excluir' },
  { id: 'approve', name: 'Aprovar' },
  { id: 'manage', name: 'Gerenciar' },
];

export function UserAccessSettings() {
  const form = useForm<AccessLevel>({
    resolver: zodResolver(accessLevelSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      isDefault: false,
      isSystem: false,
      permissions: {
        users: { view: false, create: false, edit: false, delete: false, approve: false, manage: false },
        courses: { view: false, create: false, edit: false, delete: false, approve: false, manage: false },
        certifications: { view: false, create: false, edit: false, delete: false, approve: false, manage: false },
        payments: { view: false, create: false, edit: false, delete: false, approve: false, manage: false },
        reports: { view: false, create: false, edit: false, delete: false, approve: false, manage: false },
        settings: { view: false, create: false, edit: false, delete: false, approve: false, manage: false },
      },
    },
  });

  function onSubmit(data: AccessLevel) {
    toast({
      title: 'Nível de acesso atualizado',
      description: 'As configurações de acesso foram atualizadas com sucesso.',
    });
    console.log(data);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Níveis de Acesso Predefinidos</CardTitle>
          <CardDescription>
            Níveis de acesso padrão do sistema com permissões predefinidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Padrão</TableHead>
                <TableHead>Sistema</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {defaultAccessLevels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell className="font-medium">{level.name}</TableCell>
                  <TableCell>{level.description}</TableCell>
                  <TableCell>
                    <Checkbox checked={level.isDefault} disabled />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={level.isSystem} disabled />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Nível de Acesso</CardTitle>
          <CardDescription>
            Configure as permissões para um novo nível de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Nível</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Nível Padrão</FormLabel>
                      <FormDescription>
                        Definir como nível de acesso padrão para novos usuários
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Permissões por Módulo</h3>
                
                {MODULES.map((module) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{module.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {PERMISSIONS.map((permission) => (
                          <FormField
                            key={`${module.id}.${permission.id}`}
                            control={form.control}
                            name={`permissions.${module.id}.${permission.id}`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {permission.name}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button type="submit" className="w-full">
                Criar Nível de Acesso
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
