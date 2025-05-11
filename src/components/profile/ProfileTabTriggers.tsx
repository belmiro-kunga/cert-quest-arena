import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, History, Lock, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ProfileTabTriggers: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-5'}`}>
      <TabsTrigger value="profile" className="flex items-center justify-center gap-2">
        <User size={16} />
        <span className="hidden sm:inline">Perfil</span>
      </TabsTrigger>
      <TabsTrigger value="payment" className="flex items-center justify-center gap-2">
        <CreditCard size={16} />
        <span className="hidden sm:inline">Pagamento</span>
      </TabsTrigger>
      <TabsTrigger value="history" className="flex items-center justify-center gap-2">
        <History size={16} />
        <span className="hidden sm:inline">Histórico</span>
      </TabsTrigger>
      <TabsTrigger value="affiliate" className="flex items-center justify-center gap-2">
        <Users size={16} />
        <span className="hidden sm:inline">Afiliados</span>
      </TabsTrigger>
      <TabsTrigger value="security" className="flex items-center justify-center gap-2">
        <Lock size={16} />
        <span className="hidden sm:inline">Segurança</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default ProfileTabTriggers;
