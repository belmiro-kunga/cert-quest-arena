import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Settings, Notifications, Storage, CloudUpload, Build } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface MenuItem {
  id: string;
  title: string;
  icon: JSX.Element;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'settings',
    title: 'Configurações',
    icon: <Settings />,
    path: '/admin/settings'
  },
  {
    id: 'notifications',
    title: 'Notificações',
    icon: <Notifications />,
    path: '/admin/notifications'
  },
  {
    id: 'storage',
    title: 'Armazenamento',
    icon: <Storage />,
    path: '/admin/storage'
  },
  {
    id: 'pwa',
    title: 'Configurações PWA',
    icon: <CloudUpload />,
    path: '/admin/pwa'
  },
  {
    id: 'build',
    title: 'Build',
    icon: <Build />,
    path: '/admin/build'
  }
];

interface AdminMenuProps {
  open: boolean;
  onClose: () => void;
}

export const AdminMenu: React.FC<AdminMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1e293b',
          color: '#ffffff'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => handleItemClick(item.path)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#334155',
                  color: '#ffffff'
                }
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1, borderColor: '#334155' }} />
      </Box>
    </Drawer>
  );
};
