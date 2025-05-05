
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <Card className={isMobile ? "mb-4" : ""}>
      <CardHeader className="text-center py-4 md:py-6">
        <Avatar className="w-16 h-16 md:w-24 md:h-24 mx-auto">
          <AvatarImage src={user.photo} />
          <AvatarFallback className="text-xl md:text-2xl bg-cert-blue text-white">
            {user.name ? user.name.charAt(0) : '?'}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="mt-3 md:mt-4 text-lg md:text-xl">{user.name || 'Carregando...'}</CardTitle>
        <CardDescription className="text-xs md:text-sm break-words">{user.email || 'Carregando...'}</CardDescription>
      </CardHeader>
      <CardContent className="px-3 md:px-6 py-2 md:py-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm font-medium">Plan</span>
            <span className={`text-xs md:text-sm font-semibold ${user.planType === 'Premium' ? 'text-cert-purple' : 'text-gray-500'}`}>
              {user.planType}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm font-medium">Attempts left</span>
            <span className="text-xs md:text-sm font-semibold">{user.attemptsLeft}/3</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center p-3 md:p-6">
        {user.planType === 'Freemium' ? (
          <Button 
            className="w-full bg-cert-purple hover:bg-cert-purple/90 text-xs md:text-sm py-1.5 md:py-2"
            onClick={() => navigate('/#pricing')}
          >
            Upgrade to Premium
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full text-xs md:text-sm py-1.5 md:py-2"
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
