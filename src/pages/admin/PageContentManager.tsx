import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import pageContentService, { PageContent } from '@/services/pageContentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Edit, Calendar, User, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

const PageContentManager: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const pagesData = await pageContentService.listPages();
        setPages(pagesData);
      } catch (error) {
        console.error('Erro ao carregar páginas:', error);
        toast({
          title: 'Erro ao carregar páginas',
          description: 'Não foi possível carregar as páginas. Tente novamente mais tarde.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPages();
    }
  }, [isAuthenticated, toast]);

  const getPageByKey = (key: string): PageContent | undefined => {
    return pages.find(page => page.pageKey === key);
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'Data desconhecida';
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  const renderPageCard = (pageKey: string, title: string, description: string) => {
    const page = getPageByKey(pageKey);
    
    if (loading) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {page?.title || title}
          </CardTitle>
          <CardDescription>
            {page?.subtitle || description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Última atualização: {formatDate(page?.lastUpdated)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>Seções: {page?.sections?.length || 0}</span>
            </div>
            {pageKey === 'contact' && (
              <>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>FAQs: {page?.faqs?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Emails: {page?.contactInfo?.emails?.length || 0}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link to={`/${pageKey}`} target="_blank" className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" />
              Ver página
            </Link>
          </Button>
          <Button 
            variant="default" 
            size="sm"
            asChild
          >
            <Link to={`/admin/pages/${pageKey}/edit`} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar conteúdo
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Páginas</h1>
        </div>

        <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="about">Sobre nós</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-6">
            {renderPageCard(
              'about',
              'Sobre o CertQuest Arena',
              'Página institucional com informações sobre a empresa'
            )}
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-6">
            {renderPageCard(
              'contact',
              'Entre em Contato',
              'Página com formulário e informações de contato'
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default PageContentManager;
