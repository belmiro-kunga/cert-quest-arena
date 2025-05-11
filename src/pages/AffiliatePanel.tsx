import React from 'react';
import AffiliateApplicationForm from '@/components/affiliate/AffiliateApplicationForm';
import AffiliateDashboard from '@/components/affiliate/AffiliateDashboard';
import { useToast } from '@/components/ui/use-toast';

const AffiliatePanel = () => {
  const { toast } = useToast();
  const [affiliateStatus, setAffiliateStatus] = React.useState<'pending' | 'approved' | 'none'>('none');

  React.useEffect(() => {
    // TODO: Implementar chamada à API para verificar status do afiliado
    const checkAffiliateStatus = async () => {
      try {
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAffiliateStatus('none');
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível verificar seu status de afiliado.',
          variant: 'destructive',
        });
      }
    };

    checkAffiliateStatus();
  }, [toast]);

  if (affiliateStatus === 'approved') {
    return <AffiliateDashboard />;
  }

  if (affiliateStatus === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Solicitação em Análise</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Sua solicitação para se tornar um afiliado está em análise.
          Nossa equipe entrará em contato em até 48 horas úteis.
        </p>
      </div>
    );
  }

  return <AffiliateApplicationForm />;
};

export default AffiliatePanel;
