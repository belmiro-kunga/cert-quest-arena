import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AffiliateApplicationForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: user?.name || '',
    email: user?.email || '',
    website: '',
    socialMedia: '',
    experience: '',
    marketingStrategy: '',
    expectedSales: '',
    additionalInfo: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implementar chamada à API para enviar solicitação
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação de chamada à API

      toast({
        title: 'Solicitação enviada',
        description: 'Sua solicitação para se tornar um afiliado foi enviada com sucesso. Aguarde a análise da nossa equipe.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao enviar sua solicitação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitação de Programa de Afiliados</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para se candidatar ao nosso programa de afiliados.
          Nossa equipe analisará sua solicitação em até 48 horas úteis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="website">Website (opcional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="socialMedia">Redes Sociais (opcional)</Label>
              <Input
                id="socialMedia"
                placeholder="@seu_perfil"
                value={formData.socialMedia}
                onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experiência com Marketing Digital</Label>
            <Textarea
              id="experience"
              placeholder="Descreva sua experiência com marketing digital e afiliações..."
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketingStrategy">Estratégia de Marketing</Label>
            <Textarea
              id="marketingStrategy"
              placeholder="Como você planeja promover nossos produtos?"
              value={formData.marketingStrategy}
              onChange={(e) => setFormData({ ...formData, marketingStrategy: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedSales">Expectativa de Vendas Mensais</Label>
            <Input
              id="expectedSales"
              placeholder="Ex: 10-20 vendas"
              value={formData.expectedSales}
              onChange={(e) => setFormData({ ...formData, expectedSales: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Informações Adicionais (opcional)</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Algo mais que gostaria de compartilhar?"
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AffiliateApplicationForm;
