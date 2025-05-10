import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Save, Eye, Code } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Bem-vindo',
    subject: 'Bem-vindo ao CertQuest Arena!',
    body: `Olá {{name}},

Bem-vindo ao CertQuest Arena! Estamos muito felizes em ter você conosco.

Para começar sua jornada de estudos, acesse sua conta e explore nossos cursos disponíveis.

Atenciosamente,
Equipe CertQuest Arena`,
    variables: ['name']
  },
  {
    id: 'exam-completion',
    name: 'Conclusão de Exame',
    subject: 'Parabéns! Você completou o exame',
    body: `Olá {{name}},

Parabéns por completar o exame {{examName}}!

Sua pontuação: {{score}}
Tempo gasto: {{timeSpent}}

Continue assim!`,
    variables: ['name', 'examName', 'score', 'timeSpent']
  },
  {
    id: 'password-reset',
    name: 'Redefinição de Senha',
    subject: 'Redefinição de senha solicitada',
    body: `Olá {{name}},

Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:

{{resetLink}}

Se você não solicitou esta redefinição, por favor ignore este email.

Atenciosamente,
Equipe CertQuest Arena`,
    variables: ['name', 'resetLink']
  }
];

export const EmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(defaultTemplates[0]);
  const [previewData, setPreviewData] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('edit');

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Reset preview data when changing templates
      const initialPreviewData: Record<string, string> = {};
      template.variables.forEach(variable => {
        initialPreviewData[variable] = '';
      });
      setPreviewData(initialPreviewData);
    }
  };

  const handleSaveTemplate = () => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === selectedTemplate.id ? selectedTemplate : template
      )
    );
    // TODO: Implement API call to save template
  };

  const handlePreviewDataChange = (variable: string, value: string) => {
    setPreviewData(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const getPreviewContent = () => {
    let content = selectedTemplate.body;
    Object.entries(previewData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value || `{{${key}}}`);
    });
    return content;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Templates de Email</h2>
        <Button onClick={handleSaveTemplate}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personalização de Templates</CardTitle>
            <CardDescription>
              Edite e personalize os templates de email do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-64">
                  <Label htmlFor="template-select">Selecione o Template</Label>
                  <Select
                    value={selectedTemplate.id}
                    onValueChange={handleTemplateChange}
                  >
                    <SelectTrigger id="template-select">
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="subject">Assunto do Email</Label>
                  <Input
                    id="subject"
                    value={selectedTemplate.subject}
                    onChange={(e) => setSelectedTemplate(prev => ({
                      ...prev,
                      subject: e.target.value
                    }))}
                  />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="edit">
                    <Code className="mr-2 h-4 w-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="space-y-4">
                  <div>
                    <Label htmlFor="body">Conteúdo do Email</Label>
                    <Textarea
                      id="body"
                      value={selectedTemplate.body}
                      onChange={(e) => setSelectedTemplate(prev => ({
                        ...prev,
                        body: e.target.value
                      }))}
                      className="h-64 font-mono"
                    />
                  </div>
                  <div>
                    <Label>Variáveis Disponíveis</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTemplate.variables.map(variable => (
                        <div
                          key={variable}
                          className="px-2 py-1 bg-gray-100 rounded text-sm"
                        >
                          {`{{${variable}}}`}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="space-y-4">
                  <div className="space-y-4">
                    {selectedTemplate.variables.map(variable => (
                      <div key={variable}>
                        <Label htmlFor={`preview-${variable}`}>
                          {variable.charAt(0).toUpperCase() + variable.slice(1)}
                        </Label>
                        <Input
                          id={`preview-${variable}`}
                          value={previewData[variable] || ''}
                          onChange={(e) => handlePreviewDataChange(variable, e.target.value)}
                          placeholder={`Digite o valor para ${variable}`}
                        />
                      </div>
                    ))}
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview do Email</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>Assunto</Label>
                          <div className="mt-1 p-2 bg-gray-50 rounded">
                            {selectedTemplate.subject}
                          </div>
                        </div>
                        <div>
                          <Label>Conteúdo</Label>
                          <div className="mt-1 p-4 bg-gray-50 rounded whitespace-pre-wrap">
                            {getPreviewContent()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 