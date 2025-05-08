import React, { useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n/config';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

export function LanguageManager() {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [newLanguage, setNewLanguage] = useState<Language>({
    code: '',
    name: '',
    flag: '',
  });

  const handleAddLanguage = () => {
    // TODO: Implement language addition logic
    setIsAddDialogOpen(false);
    setNewLanguage({ code: '', name: '', flag: '' });
  };

  const handleEditLanguage = () => {
    // TODO: Implement language edit logic
    setIsEditDialogOpen(false);
    setSelectedLanguage(null);
  };

  const handleDeleteLanguage = (code: string) => {
    // TODO: Implement language deletion logic
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
              <Button onClick={handleAddLanguage} className="w-full">
                {t('admin.languages.add')}
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
                  onClick={() => handleDeleteLanguage(language.code)}
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
                  onChange={(e) =>
                    setSelectedLanguage({ ...selectedLanguage, code: e.target.value })
                  }
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
              <Button onClick={handleEditLanguage} className="w-full">
                {t('admin.languages.save')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 