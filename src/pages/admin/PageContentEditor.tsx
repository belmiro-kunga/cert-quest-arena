import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import pageContentService, { PageContent, Section, FAQ, ContactInfo } from '@/services/pageContentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Trash2, Save, ArrowLeft, Edit } from 'lucide-react';

const PageContentEditor: React.FC = () => {
  const { pageKey } = useParams<{ pageKey: string }>();
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [pageData, setPageData] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [newSection, setNewSection] = useState<Partial<Section>>({ title: '', content: '', sectionKey: '' });
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [showNewSectionDialog, setShowNewSectionDialog] = useState(false);
  const [showEditSectionDialog, setShowEditSectionDialog] = useState(false);
  const [deletingSectionIndex, setDeletingSectionIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Carregar dados da página
  useEffect(() => {
    const fetchPageContent = async () => {
      if (!pageKey || !['about', 'contact'].includes(pageKey)) {
        navigate('/admin/pages');
        return;
      }

      try {
        setLoading(true);
        const data = await pageContentService.getPageContent(pageKey as 'about' | 'contact');
        setPageData(data);
      } catch (error) {
        console.error(`Erro ao carregar conteúdo da página ${pageKey}:`, error);
        toast({
          title: 'Erro ao carregar página',
          description: 'Não foi possível carregar o conteúdo da página. Tente novamente mais tarde.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && pageKey) {
      fetchPageContent();
    }
  }, [isAuthenticated, pageKey, navigate, toast]);

  // Atualizar o título e subtítulo da página
  const handleGeneralInfoChange = (field: 'title' | 'subtitle', value: string) => {
    if (!pageData) return;
    
    setPageData({
      ...pageData,
      [field]: value
    });
  };

  // Salvar alterações gerais
  const handleSaveGeneral = async () => {
    if (!pageData || !pageKey) return;
    
    try {
      setSaving(true);
      
      const { title, subtitle } = pageData;
      await pageContentService.updatePageContent(pageKey as 'about' | 'contact', { title, subtitle });
      
      toast({
        title: 'Informações gerais salvas',
        description: 'As informações gerais da página foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao salvar informações gerais:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as informações gerais. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Gerenciar nova seção
  const handleNewSectionChange = (field: keyof Section, value: string) => {
    setNewSection({
      ...newSection,
      [field]: value
    });
  };

  // Adicionar nova seção
  const handleAddSection = async () => {
    if (!pageData || !pageKey || !newSection.title || !newSection.content || !newSection.sectionKey) {
      toast({
        title: 'Dados incompletos',
        description: 'Preencha todos os campos da seção.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const updatedPage = await pageContentService.addSection(
        pageKey as 'about' | 'contact', 
        {
          sectionKey: newSection.sectionKey,
          title: newSection.title,
          content: newSection.content,
          order: pageData.sections.length
        }
      );
      
      setPageData(updatedPage);
      setNewSection({ title: '', content: '', sectionKey: '' });
      setShowNewSectionDialog(false);
      
      toast({
        title: 'Seção adicionada',
        description: 'A nova seção foi adicionada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao adicionar seção:', error);
      toast({
        title: 'Erro ao adicionar seção',
        description: 'Não foi possível adicionar a seção. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Editar seção existente
  const handleEditSection = (index: number) => {
    if (!pageData) return;
    
    const section = pageData.sections[index];
    setNewSection({
      sectionKey: section.sectionKey,
      title: section.title,
      content: section.content,
      order: section.order
    });
    setEditingSectionIndex(index);
    setShowEditSectionDialog(true);
  };

  // Salvar edição de seção
  const handleSaveEditedSection = async () => {
    if (!pageData || !pageKey || editingSectionIndex === null || !newSection.title || !newSection.content) {
      return;
    }
    
    try {
      setSaving(true);
      
      const section = pageData.sections[editingSectionIndex];
      const updatedPage = await pageContentService.updateSection(
        pageKey as 'about' | 'contact',
        section.sectionKey,
        {
          title: newSection.title,
          content: newSection.content,
          order: newSection.order !== undefined ? newSection.order : section.order
        }
      );
      
      setPageData(updatedPage);
      setNewSection({ title: '', content: '', sectionKey: '' });
      setEditingSectionIndex(null);
      setShowEditSectionDialog(false);
      
      toast({
        title: 'Seção atualizada',
        description: 'A seção foi atualizada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar seção:', error);
      toast({
        title: 'Erro ao atualizar seção',
        description: 'Não foi possível atualizar a seção. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Confirmar exclusão de seção
  const confirmDeleteSection = (index: number) => {
    setDeletingSectionIndex(index);
  };

  // Excluir seção
  const handleDeleteSection = async () => {
    if (!pageData || !pageKey || deletingSectionIndex === null) {
      return;
    }
    
    try {
      setSaving(true);
      
      const section = pageData.sections[deletingSectionIndex];
      const result = await pageContentService.removeSection(
        pageKey as 'about' | 'contact',
        section.sectionKey
      );
      
      setPageData(result.page);
      setDeletingSectionIndex(null);
      
      toast({
        title: 'Seção removida',
        description: 'A seção foi removida com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao remover seção:', error);
      toast({
        title: 'Erro ao remover seção',
        description: 'Não foi possível remover a seção. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Renderizar o editor de acordo com o tipo de página
  const renderEditor = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Carregando conteúdo...</span>
        </div>
      );
    }

    if (!pageData) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-500">Não foi possível carregar o conteúdo da página.</p>
          <Button onClick={() => navigate('/admin/pages')} className="mt-4">
            Voltar para o gerenciador de páginas
          </Button>
        </div>
      );
    }

    return (
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="sections">Seções</TabsTrigger>
          {pageKey === 'contact' && <TabsTrigger value="contact-info">Informações de Contato</TabsTrigger>}
          {pageKey === 'contact' && <TabsTrigger value="faqs">Perguntas Frequentes</TabsTrigger>}
        </TabsList>
        
        {/* Informações Gerais */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Edite o título e subtítulo da página {pageKey === 'about' ? '"Sobre nós"' : '"Entre em contato"'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Página</Label>
                <Input
                  id="title"
                  value={pageData.title}
                  onChange={(e) => handleGeneralInfoChange('title', e.target.value)}
                  placeholder="Título da página"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Textarea
                  id="subtitle"
                  value={pageData.subtitle}
                  onChange={(e) => handleGeneralInfoChange('subtitle', e.target.value)}
                  placeholder="Subtítulo ou descrição breve da página"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveGeneral} 
                disabled={saving}
                className="ml-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Seções */}
        <TabsContent value="sections">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Seções da Página</h3>
            <Dialog open={showNewSectionDialog} onOpenChange={setShowNewSectionDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Seção
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Seção</DialogTitle>
                  <DialogDescription>
                    Preencha os campos abaixo para adicionar uma nova seção à página.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sectionKey">Chave da Seção</Label>
                    <Input
                      id="sectionKey"
                      value={newSection.sectionKey || ''}
                      onChange={(e) => handleNewSectionChange('sectionKey', e.target.value)}
                      placeholder="Identificador único (ex: mission, values, history)"
                    />
                    <p className="text-xs text-gray-500">
                      Use um identificador único sem espaços ou caracteres especiais
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sectionTitle">Título da Seção</Label>
                    <Input
                      id="sectionTitle"
                      value={newSection.title || ''}
                      onChange={(e) => handleNewSectionChange('title', e.target.value)}
                      placeholder="Título da seção"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sectionContent">Conteúdo</Label>
                    <Textarea
                      id="sectionContent"
                      value={newSection.content || ''}
                      onChange={(e) => handleNewSectionChange('content', e.target.value)}
                      placeholder="Conteúdo da seção"
                      rows={6}
                    />
                    <p className="text-xs text-gray-500">
                      Para a seção de valores, separe os valores por vírgulas. Para outras seções, você pode usar quebras de linha para parágrafos.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewSectionDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddSection} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adicionando...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Seção
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Diálogo de edição de seção */}
            <Dialog open={showEditSectionDialog} onOpenChange={setShowEditSectionDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Seção</DialogTitle>
                  <DialogDescription>
                    Edite os campos da seção selecionada.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="editSectionKey">Chave da Seção</Label>
                    <Input
                      id="editSectionKey"
                      value={newSection.sectionKey || ''}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500">
                      A chave da seção não pode ser alterada
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editSectionTitle">Título da Seção</Label>
                    <Input
                      id="editSectionTitle"
                      value={newSection.title || ''}
                      onChange={(e) => handleNewSectionChange('title', e.target.value)}
                      placeholder="Título da seção"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editSectionContent">Conteúdo</Label>
                    <Textarea
                      id="editSectionContent"
                      value={newSection.content || ''}
                      onChange={(e) => handleNewSectionChange('content', e.target.value)}
                      placeholder="Conteúdo da seção"
                      rows={6}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditSectionDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEditedSection} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de seções */}
          <div className="space-y-4">
            {pageData.sections.length === 0 ? (
              <div className="text-center p-8 border rounded-lg bg-gray-50">
                <p className="text-gray-500">Nenhuma seção encontrada. Adicione uma nova seção para começar.</p>
              </div>
            ) : (
              pageData.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <Card key={section.sectionKey}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{section.title}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSection(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDeleteSection(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        Chave: {section.sectionKey} | Ordem: {section.order}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-40 overflow-y-auto">
                        <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
        
        {/* Informações de Contato (apenas para página de contato) */}
        {pageKey === 'contact' && (
          <TabsContent value="contact-info">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Edite as informações de contato exibidas na página
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">
                  Editor de informações de contato será implementado em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {/* FAQs (apenas para página de contato) */}
        {pageKey === 'contact' && (
          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>
                  Gerencie as perguntas frequentes exibidas na página de contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">
                  Editor de FAQs será implementado em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/pages')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">
            Editar Página: {pageKey === 'about' ? 'Sobre nós' : 'Entre em contato'}
          </h1>
        </div>

        {renderEditor()}

        {/* Diálogo de confirmação para excluir seção */}
        <AlertDialog open={deletingSectionIndex !== null} onOpenChange={(open) => !open && setDeletingSectionIndex(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente a seção e seu conteúdo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSection} className="bg-red-600 hover:bg-red-700">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default PageContentEditor;
