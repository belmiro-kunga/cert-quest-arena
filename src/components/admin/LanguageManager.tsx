import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

interface Language {
  code: string;
  name: string;
  flag: string;
}

export function LanguageManager() {
  const { t } = useTranslation();
  const { addNewLanguage, updateLanguage: updateLanguageInConfig, removeLanguage } = useLanguage();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [newLanguage, setNewLanguage] = useState<Language>({
    code: '',
    name: '',
    flag: '',
  });
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch languages from database
  useEffect(() => {
    const loadLanguages = async () => {
      setIsLoading(true);
      try {
        const dbLanguages = await fetchLanguages();
        setLanguages(dbLanguages);
      } catch (error) {
        console.error('Error fetching languages:', error);
        toast({
          title: t('errors.errorOccurred'),
          description: String(error),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLanguages();
  }, [t]);

  const handleAddLanguage = async () => {
    if (!newLanguage.code || !newLanguage.name) {
      toast({
        title: t('errors.required'),
        description: t('admin.languages.codeAndNameRequired'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Add to database
      const dbLanguage = await createLanguage(newLanguage);
      
      // Update the local i18n config
      await addNewLanguage(newLanguage.code, newLanguage.name, newLanguage.flag, {});
      
      // Update local state
      setLanguages([...languages, dbLanguage]);
      
      // Close dialog and reset form
      setIsAddDialogOpen(false);
      setNewLanguage({ code: '', name: '', flag: '' });
      
      toast({
        title: t('success.created'),
        description: t('admin.languages.languageAdded'),
      });
    } catch (error) {
      console.error('Error adding language:', error);
      toast({
        title: t('errors.errorOccurred'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLanguage = async () => {
    if (!selectedLanguage || !selectedLanguage.code || !selectedLanguage.name) {
      toast({
        title: t('errors.required'),
        description: t('admin.languages.codeAndNameRequired'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update in database
      await updateLanguage(selectedLanguage);
      
      // Update in local i18n config
      updateLanguageInConfig(selectedLanguage.code, selectedLanguage.name, selectedLanguage.flag);
      
      // Update local state
      setLanguages(languages.map(lang => 
        lang.code === selectedLanguage.code ? selectedLanguage : lang
      ));
      
      // Close dialog and reset form
      setIsEditDialogOpen(false);
      setSelectedLanguage(null);
      
      toast({
        title: t('success.updated'),
        description: t('admin.languages.languageUpdated'),
      });
    } catch (error) {
      console.error('Error updating language:', error);
      toast({
        title: t('errors.errorOccurred'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLanguage = async () => {
    if (!selectedLanguage) return;
    
    setIsLoading(true);
    try {
      // Delete from database
      await deleteLanguage(selectedLanguage.code);
      
      // Delete from local i18n config
      removeLanguage(selectedLanguage.code);
      
      // Update local state
      setLanguages(languages.filter(lang => lang.code !== selectedLanguage.code));
      
      // Close dialog and reset selection
      setIsDeleteDialogOpen(false);
      setSelectedLanguage(null);
      
      toast({
        title: t('success.deleted'),
        description: t('admin.languages.languageDeleted'),
      });
    } catch (error) {
      console.error('Error deleting language:', error);
      toast({
        title: t('errors.errorOccurred'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('admin.languages.title')}</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.languages.add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.languages.add')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="code">{t('admin.languages.code')}</label>
                <Input
                  id="code"
                  value={newLanguage.code}
                  onChange={(e) =>
                    setNewLanguage({ ...newLanguage, code: e.target.value })
                  }
                  placeholder="en-US"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name">{t('admin.languages.name')}</label>
                <Input
                  id="name"
                  value={newLanguage.name}
                  onChange={(e) =>
                    setNewLanguage({ ...newLanguage, name: e.target.value })
                  }
                  placeholder="English"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="flag">{t('admin.languages.flag')}</label>
                <Input
                  id="flag"
                  value={newLanguage.flag}
                  onChange={(e) =>
                    setNewLanguage({ ...newLanguage, flag: e.target.value })
                  }
                  placeholder="🇺🇸"
                />
              </div>
              <Button onClick={handleAddLanguage} className="w-full" disabled={isLoading}>
                {isLoading ? 'Adding...' : t('admin.languages.add')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.languages.code')}</TableHead>
            <TableHead>{t('admin.languages.name')}</TableHead>
            <TableHead>{t('admin.languages.flag')}</TableHead>
            <TableHead className="text-right">{t('admin.languages.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {languages.map((language) => (
            <TableRow key={language.code}>
              <TableCell>{language.code}</TableCell>
              <TableCell>{language.name}</TableCell>
              <TableCell>{language.flag}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedLanguage(language);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedLanguage(language);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.languages.edit')}</DialogTitle>
          </DialogHeader>
          {selectedLanguage && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-code">{t('admin.languages.code')}</label>
                <Input
                  id="edit-code"
                  value={selectedLanguage.code}
                  readOnly // Code shouldn't be editable as it's the primary key
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-name">{t('admin.languages.name')}</label>
                <Input
                  id="edit-name"
                  value={selectedLanguage.name}
                  onChange={(e) =>
                    setSelectedLanguage({ ...selectedLanguage, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-flag">{t('admin.languages.flag')}</label>
                <Input
                  id="edit-flag"
                  value={selectedLanguage.flag}
                  onChange={(e) =>
                    setSelectedLanguage({ ...selectedLanguage, flag: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleEditLanguage} className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : t('admin.languages.save')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.languages.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.languages.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.languages.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLanguage} disabled={isLoading}>
              {isLoading ? 'Deleting...' : t('admin.languages.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
