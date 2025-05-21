export const NATIVE_API_CONFIG = {
  SHARE: {
    available: 'share' in navigator,
    permissions: ['clipboard-write']
  },
  CAMERA: {
    available: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    permissions: ['camera']
  },
  VIBRATE: {
    available: 'vibrate' in navigator,
    permissions: []
  },
  NOTIFICATIONS: {
    available: 'Notification' in self,
    permissions: ['notifications']
  }
};

export const checkNativeAPIAvailability = (api: keyof typeof NATIVE_API_CONFIG) => {
  return NATIVE_API_CONFIG[api].available;
};

export const requestNativeAPIPermissions = async (api: keyof typeof NATIVE_API_CONFIG) => {
  if (!NATIVE_API_CONFIG[api].permissions.length) return true;
  
  try {
    const permissionStatus = await navigator.permissions.query({
      name: NATIVE_API_CONFIG[api].permissions[0] as PermissionName
    });
    return permissionStatus.state === 'granted';
  } catch (error) {
    console.error('Erro ao solicitar permissão:', error);
    return false;
  }
};
