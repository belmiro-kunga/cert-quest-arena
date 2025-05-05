
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';

interface ProfileTabProps {
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  updateUserProfile: (userData: any) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, updateUserProfile }) => {
  const { toast } = useToast();
  
  const profileFormSchema = z.object({
    name: z.string().min(2, {
      message: "Name must have at least 2 characters.",
    }),
    email: z.string().email({
      message: "Invalid email.",
    }),
    phone: z.string().optional()
  });

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone
    },
  });
  
  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    updateUserProfile({
      name: values.name,
      email: values.email,
      phone: values.phone || ''
    });
    
    toast({
      title: "Profile updated",
      description: "Your information has been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information here. Click save when you're done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <FormField
              control={profileForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={profileForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
