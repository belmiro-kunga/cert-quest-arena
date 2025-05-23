import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

// Import our components
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileTabTriggers from '@/components/profile/ProfileTabTriggers';
import ProfileTab from '@/components/profile/tabs/ProfileTab';
import HistoryTab from '@/components/profile/tabs/HistoryTab';
import SecurityTab from '@/components/profile/tabs/SecurityTab';
import AffiliateTab from '@/components/profile/tabs/AffiliateTab';

const ProfilePage = () => {
  const { user: authUser, updateUserProfile } = useAuth();
  
  // Merged user state with default values and auth user data
  const [user, setUser] = useState({
    name: '',
    email: '',
    photo: '',
    phone: '',

    attemptsLeft: 1,
    paymentMethod: {
      type: 'credit',
      lastFour: '4242',
      expiry: '04/25'
    },
    invoices: [
      { id: 'INV-001', date: '04/01/2025', amount: '$29.99', status: 'Paid' },
      { id: 'INV-002', date: '04/03/2025', amount: '$29.99', status: 'Paid' }
    ],
    examHistory: [
      { id: 1, cert: 'AWS Cloud Practitioner', date: '04/25/2025', score: 70, result: 'Passed' },
      { id: 2, cert: 'CompTIA A+', date: '04/20/2025', score: 65, result: 'Failed' },
      { id: 3, cert: 'AWS Cloud Practitioner', date: '04/18/2025', score: 60, result: 'Failed' }
    ],
    certificates: [
      { id: 'aws-cloud-practitioner', name: 'AWS Cloud Practitioner', acquired: '04/25/2025' }
    ],
    affiliate: {
      status: null,
      earnings: 0,
      referrals: 0,
      link: ''
    }
  });

  // Update user data when authUser changes
  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        name: authUser.name || prev.name,
        email: authUser.email || prev.email,
        photo: authUser.photo || prev.photo,
        phone: authUser.email || prev.phone,
        planType: authUser.planType || prev.planType,
        attemptsLeft: authUser.attemptsLeft || prev.attemptsLeft,
      }));
    }
  }, [authUser]);

  // Handle profile updates
  const handleUpdateProfile = (userData: Partial<typeof user>) => {
    setUser(prev => ({ ...prev, ...userData }));
    if (updateUserProfile) {
      updateUserProfile(userData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar with user information */}
            <div className="w-full md:w-1/4">
              <ProfileSidebar user={user} />
            </div>
            
            {/* Main content with tabs */}
            <div className="w-full md:w-3/4">
              <Tabs defaultValue="profile">
                <ProfileTabTriggers />
                
                {/* Tab contents */}
                <TabsContent value="profile">
                  <ProfileTab 
                    user={user} 
                    updateUserProfile={handleUpdateProfile} 
                  />
                </TabsContent>
                
                <TabsContent value="history">
                  <HistoryTab user={user} />
                </TabsContent>

                <TabsContent value="affiliate">
                  <AffiliateTab user={user} />
                </TabsContent>
                
                <TabsContent value="security">
                  <SecurityTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
