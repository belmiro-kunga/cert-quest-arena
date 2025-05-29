
// Mock database configuration
export const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'cert_quest',
  user: 'postgres',
  password: 'password',
};

export const connectDB = async () => {
  console.log('Mock database connection');
  return true;
};
