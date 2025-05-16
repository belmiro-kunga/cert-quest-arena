import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const SecurityTab: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your password and security settings.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-base font-medium">Change Password</h4>
          <p className="text-sm text-muted-foreground">
            Update your password to keep your account secure.
          </p>
          <div className="mt-4">
            <Button>Change Password</Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-base font-medium">Two-Factor Authentication</h4>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account.
          </p>
          <div className="mt-4">
            <Button variant="outline">Setup 2FA</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
