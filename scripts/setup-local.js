import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL and Anon Key must be defined in .env file');
  process.exit(1);
}

// Criar cliente do Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Criar usuários de teste
    const users = [
      {
        email: 'admin@certquest.com',
        password: 'admin123',
        name: 'Admin',
        role: 'admin',
        plan_type: 'premium',
        attempts_left: -1
      },
      {
        email: 'user@certquest.com',
        password: 'user123',
        name: 'Test User',
        role: 'user',
        plan_type: 'free',
        attempts_left: 3
      }
    ];

    for (const user of users) {
      // Criar usuário
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            role: user.role
          }
        }
      });

      if (userError) {
        console.error(`Error creating user ${user.email}:`, userError);
        continue;
      }

      console.log(`User ${user.email} created successfully!`);

      // Criar perfil
      if (userData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: userData.user.id,
            name: user.name,
            role: user.role,
            plan_type: user.plan_type,
            attempts_left: user.attempts_left
          });

        if (profileError) {
          console.error(`Error creating profile for ${user.email}:`, profileError);
          continue;
        }

        console.log(`Profile for ${user.email} created successfully!`);
      }
    }

    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

setupDatabase();
