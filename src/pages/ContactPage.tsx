import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formState.name || !formState.email || !formState.message) {
      return;
    }
    
    setFormStatus('submitting');
    
    try {
      // Simulação de envio - em produção, substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Limpar o formulário após envio bem-sucedido
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setFormStatus('success');
      
      // Resetar o status após alguns segundos
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setFormStatus('error');
      
      // Resetar o status após alguns segundos
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-cert-blue text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Estamos aqui para ajudar. Entre em contato conosco para tirar dúvidas, 
              fazer sugestões ou solicitar informações.
            </p>
          </div>
        </div>

        {/* Formulário de Contato e Informações */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Informações de Contato */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-4 flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-cert-blue" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">contato@certquestarena.com</p>
                        <p className="text-gray-600">suporte@certquestarena.com</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Telefone</h3>
                        <p className="text-gray-600">+55 (11) 3456-7890</p>
                        <p className="text-gray-600">Segunda a Sexta, 9h às 18h</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Endereço</h3>
                        <p className="text-gray-600">
                          Av. Paulista, 1000, Bela Vista
                        </p>
                        <p className="text-gray-600">
                          São Paulo - SP, 01310-100
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-start space-x-4">
                      <div className="bg-orange-100 p-3 rounded-full">
                        <MessageSquare className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Redes Sociais</h3>
                        <div className="flex space-x-4 mt-2">
                          <a href="https://twitter.com/certquestarena" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cert-blue">
                            Twitter
                          </a>
                          <a href="https://facebook.com/certquestarena" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cert-blue">
                            Facebook
                          </a>
                          <a href="https://linkedin.com/company/certquestarena" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cert-blue">
                            LinkedIn
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Formulário de Contato */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Envie uma Mensagem</h2>
                    
                    {formStatus === 'success' && (
                      <Alert className="mb-6 bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle>Mensagem enviada!</AlertTitle>
                        <AlertDescription>
                          Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {formStatus === 'error' && (
                      <Alert className="mb-6 bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle>Erro ao enviar</AlertTitle>
                        <AlertDescription>
                          Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome completo</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            placeholder="Seu nome completo"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleChange}
                            placeholder="seu.email@exemplo.com"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          placeholder="Assunto da mensagem"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Mensagem</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          placeholder="Digite sua mensagem aqui..."
                          rows={6}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto"
                        disabled={formStatus === 'submitting'}
                      >
                        {formStatus === 'submitting' ? 'Enviando...' : 'Enviar Mensagem'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Como posso obter suporte técnico?</h3>
                  <p className="text-gray-600">
                    Para suporte técnico, envie um email para suporte@certquestarena.com ou utilize o 
                    formulário de contato nesta página. Nossa equipe responderá em até 24 horas úteis.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Vocês oferecem descontos para grupos ou empresas?</h3>
                  <p className="text-gray-600">
                    Sim, oferecemos planos especiais para empresas e grupos de estudo. Entre em contato 
                    conosco pelo email comercial@certquestarena.com para discutir suas necessidades específicas.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Como posso sugerir uma nova certificação?</h3>
                  <p className="text-gray-600">
                    Adoramos receber sugestões! Utilize o formulário de contato e selecione "Sugestão" 
                    como assunto. Nossa equipe avaliará a viabilidade e entrará em contato com você.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Posso me tornar um colaborador ou criador de conteúdo?</h3>
                  <p className="text-gray-600">
                    Estamos sempre em busca de especialistas para colaborar com nosso conteúdo. Se você 
                    tem experiência em certificações, envie seu currículo e áreas de especialidade para 
                    colaboradores@certquestarena.com.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
