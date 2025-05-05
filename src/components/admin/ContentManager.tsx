
import React, { useState, useEffect } from 'react';
import { Book, FileText, HelpCircle, MessageCircle, Image, Plus, Edit, Trash, Tag, FolderOpen } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ContentItem, ContentCategory, ContentTag, ContentType } from '@/types/admin';
import { fetchContentItems, createContentItem, updateContentItem, deleteContentItem, fetchContentCategories, fetchContentTags } from '@/services/contentService';

// Componente para gerenciar conteúdo no painel de administração
export function ContentManager() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [tags, setTags] = useState<ContentTag[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Estados para o formulário
  const [formData, setFormData] = useState<Partial<ContentItem>>({
    title: '',
    type: 'page',
    content: '',
    status: 'draft',
    slug: '',
    tags: [],
    category: '',
    featured: false
  });

  // Carrega os dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const items = await fetchContentItems(activeTab !== 'all' ? activeTab : undefined);
        setContentItems(items);
        
        const fetchedCategories = await fetchContentCategories();
        setCategories(fetchedCategories);
        
        const fetchedTags = await fetchContentTags();
        setTags(fetchedTags);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do conteúdo',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [activeTab, toast]);

  // Filtra os itens de conteúdo com base no termo de busca
  const filteredItems = contentItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manipula a mudança de aba
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Manipula a mudança no formulário
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manipula a mudança no select
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gera um slug a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  // Manipula a mudança de título e gera um slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  // Abre o diálogo para criar um novo item
  const handleCreateNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      type: 'page',
      content: '',
      status: 'draft',
      slug: '',
      tags: [],
      category: '',
      featured: false
    });
    setIsDialogOpen(true);
  };

  // Abre o diálogo para editar um item existente
  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({
      ...item
    });
    setIsDialogOpen(true);
  };

  // Manipula a exclusão de um item
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        const success = await deleteContentItem(id);
        if (success) {
          setContentItems(prev => prev.filter(item => item.id !== id));
          toast({
            title: 'Sucesso',
            description: 'Item de conteúdo excluído com sucesso',
          });
        }
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir o item',
          variant: 'destructive'
        });
      }
    }
  };

  // Manipula o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Atualiza um item existente
        const updatedItem = await updateContentItem(editingItem.id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        
        if (updatedItem) {
          setContentItems(prev => 
            prev.map(item => item.id === updatedItem.id ? updatedItem : item)
          );
          toast({
            title: 'Sucesso',
            description: 'Item de conteúdo atualizado com sucesso'
          });
        }
      } else {
        // Cria um novo item
        const newItem = await createContentItem({
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'Admin' // Idealmente seria o usuário atual
        });
        
        if (newItem) {
          setContentItems(prev => [...prev, newItem]);
          toast({
            title: 'Sucesso',
            description: 'Item de conteúdo criado com sucesso'
          });
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o item',
        variant: 'destructive'
      });
    }
  };

  // Ícone baseado no tipo de conteúdo
  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case 'page':
        return <FileText className="h-4 w-4" />;
      case 'post':
        return <Book className="h-4 w-4" />;
      case 'faq':
        return <HelpCircle className="h-4 w-4" />;
      case 'testimonial':
        return <MessageCircle className="h-4 w-4" />;
      case 'banner':
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciador de Conteúdo</CardTitle>
          <CardDescription>Gerencie todo o conteúdo do seu site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input 
              placeholder="Pesquisar conteúdo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-1" /> Novo conteúdo
            </Button>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="mt-4"
          >
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="page">Páginas</TabsTrigger>
              <TabsTrigger value="post">Posts</TabsTrigger>
              <TabsTrigger value="faq">FAQs</TabsTrigger>
              <TabsTrigger value="testimonial">Depoimentos</TabsTrigger>
              <TabsTrigger value="banner">Banners</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <p>Carregando conteúdo...</p>
                </div>
              ) : filteredItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Atualização</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center">
                            {getContentIcon(item.type)}
                            <span className="ml-2">{item.title}</span>
                            {item.featured && (
                              <Badge variant="secondary" className="ml-2">Destaque</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.type === 'page' && 'Página'}
                            {item.type === 'post' && 'Post'}
                            {item.type === 'faq' && 'FAQ'}
                            {item.type === 'testimonial' && 'Depoimento'}
                            {item.type === 'banner' && 'Banner'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                            {item.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    Nenhum conteúdo encontrado. Clique em "Novo conteúdo" para adicionar.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Diálogo para criar/editar conteúdo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar conteúdo' : 'Novo conteúdo'}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? 'Faça as alterações desejadas e salve para atualizar o conteúdo.'
                : 'Preencha os campos para criar um novo item de conteúdo.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Título e tipo */}
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label htmlFor="title" className="text-sm font-medium">
                    Título
                  </label>
                  <Input 
                    id="title"
                    name="title"
                    value={formData.title} 
                    onChange={handleTitleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="type" className="text-sm font-medium">
                    Tipo
                  </label>
                  <Select
                    value={formData.type as string}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page">Página</SelectItem>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="testimonial">Depoimento</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* URL amigável e status */}
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label htmlFor="slug" className="text-sm font-medium">
                    URL amigável
                  </label>
                  <Input 
                    id="slug"
                    name="slug"
                    value={formData.slug} 
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={formData.status as string}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Categoria e destaque */}
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoria
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end mb-1">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Destaque
                    </label>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div>
                <label htmlFor="content" className="text-sm font-medium">
                  Conteúdo
                </label>
                <Textarea 
                  id="content"
                  name="content"
                  value={formData.content || ''}
                  onChange={handleFormChange}
                  rows={10}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingItem ? 'Salvar alterações' : 'Criar conteúdo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Seção de categorias e tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Categorias de Conteúdo</CardTitle>
            <CardDescription>Gerencie as categorias para organizar o conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <Input placeholder="Nova categoria..." />
                <Button>Adicionar</Button>
              </div>
            </div>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex justify-between items-center p-2 rounded bg-secondary/20">
                  <div className="flex items-center">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    <span>{category.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma categoria disponível
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags de Conteúdo</CardTitle>
            <CardDescription>Gerencie as tags para classificar o conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <Input placeholder="Nova tag..." />
                <Button>Adicionar</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="flex items-center space-x-1 py-1">
                  <span>{tag.name}</span>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    <Trash className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {tags.length === 0 && (
                <p className="text-muted-foreground text-center w-full py-4">
                  Nenhuma tag disponível
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
