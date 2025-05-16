import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import TwoFactorSetup from '@/components/auth/TwoFactorSetup';
const SecurityTab: React.FC = () => {
  const { toast } = useToast();
  
  // Esquema de validação para o formulário de senha
  const passwordFormSchema = z.object({
    currentPassword: z.string().min(6, {
      message: "Current password must have at least 6 characters.",
    }),
    newPassword: z.string().min(6, {
      message: "New password must have at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must have at least 6 characters.",
    }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  
  // Formulário para alteração de senha
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });
  
  // Função para atualizar a senha
  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    passwordForm.reset();
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>
          Manage your password and security settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seção de alteração de senha */}
        <div>
          <h3 className="text-lg font-medium mb-2">Change Password</h3>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Change Password</Button>
            </form>
          </Form>
        </div>
        
        {/* Seção de 2FA */}
        <div className="pt-4 border-t">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Two-Factor Authentication (2FA)</h3>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account by requiring a verification code.
            </p>
          </div>
          
          <TwoFactorSetup />
        </div>
        
        {/* Seção de preferências de notificação */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-updates">Email updates</Label>
              <input
                id="email-updates"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing">Marketing and promotions</Label>
              <input
                id="marketing"
                type="checkbox"
                defaultChecked={false}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="new-certs">New certifications available</Label>
              <input
                id="new-certs"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
        
        {/* Zona de perigo */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
          <p className="text-sm text-gray-500 mb-4">
            These actions cannot be undone. Please be sure before proceeding.
          </p>
          <div className="space-y-3">
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              Delete exam history
            </Button>
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              Delete account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;