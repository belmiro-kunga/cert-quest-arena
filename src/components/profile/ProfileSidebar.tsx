
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileSidebarProps {
  user: {
    name: string;
    email: string;
    photo?: string;
    planType: string;
    attemptsLeft: number;
  };
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={user.photo} />
          <AvatarFallback className="text-2xl bg-cert-blue text-white">
            {user.name ? user.name.charAt(0) : '?'}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4">{user.name || 'Carregando...'}</CardTitle>
        <CardDescription>{user.email || 'Carregando...'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Plan</span>
            <span className={`text-sm font-semibold ${user.planType === 'Premium' ? 'text-cert-purple' : 'text-gray-500'}`}>
              {user.planType}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Attempts left</span>
            <span className="text-sm font-semibold">{user.attemptsLeft}/3</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {user.planType === 'Freemium' ? (
          <Button 
            className="w-full bg-cert-purple hover:bg-cert-purple/90"
            onClick={() => navigate('/#pricing')}
          >
            Upgrade to Premium
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Access Dashboard
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileSidebar;
