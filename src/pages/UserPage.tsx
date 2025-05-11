import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserSidebar from '@/components/UserSidebar';
import AffiliatePanel from './AffiliatePanel';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const UserPage = () => {
  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="flex">
          <UserSidebar />
          <div className="flex-1">
            <div className="border-b">
              <div className="flex h-16 items-center px-4 gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Pesquisar..." className="pl-8" />
                  </div>
                </div>
                <Button size="icon" variant="ghost">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-8">
              <Routes>
                <Route path="/affiliate" element={<AffiliatePanel />} />
                {/* TODO: Adicionar outras rotas do usuário */}
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
