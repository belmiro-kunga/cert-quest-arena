import { supabase } from '../src/integrations/supabase/client';

async function createTestUsers() {
  try {
    // Criar usuário admin
    const { data: adminData, error: adminError } = await supabase.auth.signUp({
      email: 'admin@certquest.com',
      password: 'admin123',
      options: {
        data: {
          name: 'Admin',
          role: 'admin'
        }
      }
    });

    if (adminError) throw adminError;
    console.log('Admin user created:', adminData);

    // Criar perfil do admin
    if (adminData.user) {
      const { error: adminProfileError } = await supabase
        .from('profiles')
        .insert({
          user_id: adminData.user.id,
          name: 'Admin',
          role: 'admin',
          plan_type: 'premium',
          attempts_left: -1 // Ilimitado
        });

      if (adminProfileError) throw adminProfileError;
      console.log('Admin profile created');
    }

    // Criar usuário normal
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: 'user@certquest.com',
      password: 'user123',
      options: {
        data: {
          name: 'Test User',
          role: 'user'
        }
      }
    });

    if (userError) throw userError;
    console.log('Test user created:', userData);

    // Criar perfil do usuário
    if (userData.user) {
      const { error: userProfileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userData.user.id,
          name: 'Test User',
          role: 'user',
          plan_type: 'free',
          attempts_left: 3
        });

      if (userProfileError) throw userProfileError;
      console.log('User profile created');
    }

    console.log('Test users created successfully!');
  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

createTestUsers();
