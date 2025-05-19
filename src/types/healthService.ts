interface HealthStatus {
  health: boolean;
  simulados: boolean;
}

// Temporary mock function until Supabase implementation
export const checkAllEndpoints = async (): Promise<HealthStatus> => {
  console.log('TODO: Implement with Supabase - checkAllEndpoints');
  return {
    health: true,
    simulados: true
  };
}; 