
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, History, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ProfileTabTriggers: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-1' : 'grid-cols-4'}`}>
      <TabsTrigger value="profile" className="flex items-center justify-center gap-2">
        <User size={16} />
        <span className="hidden sm:inline">Profile</span>
      </TabsTrigger>
      <TabsTrigger value="payment" className="flex items-center justify-center gap-2">
        <CreditCard size={16} />
        <span className="hidden sm:inline">Payment</span>
      </TabsTrigger>
      <TabsTrigger value="history" className="flex items-center justify-center gap-2">
        <History size={16} />
        <span className="hidden sm:inline">History</span>
      </TabsTrigger>
      <TabsTrigger value="security" className="flex items-center justify-center gap-2">
        <Lock size={16} />
        <span className="hidden sm:inline">Security</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default ProfileTabTriggers;
