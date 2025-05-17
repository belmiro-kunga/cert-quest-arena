import * as UAParser from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';

interface DeviceInfo {
  deviceId: string;
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  device: {
    type: string;
    vendor: string;
    model: string;
  };
  lastLogin: Date;
}

const DEVICE_STORAGE_KEY = 'certquest_known_devices';
const CURRENT_DEVICE_KEY = 'certquest_current_device';

/**
 * Gera informações sobre o dispositivo atual
 */
export const getCurrentDeviceInfo = (): DeviceInfo => {
  const parser = new UAParser.UAParser();
  const result = parser.getResult();
  
  // Verificar se já existe um ID para este dispositivo
  let deviceId = localStorage.getItem(CURRENT_DEVICE_KEY);
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(CURRENT_DEVICE_KEY, deviceId);
  }
  
  return {
    deviceId,
    browser: {
      name: result.browser.name || 'Desconhecido',
      version: result.browser.version || 'Desconhecido'
    },
    os: {
      name: result.os.name || 'Desconhecido',
      version: result.os.version || 'Desconhecido'
    },
    device: {
      type: result.device.type || 'desktop',
      vendor: result.device.vendor || 'Desconhecido',
      model: result.device.model || 'Desconhecido'
    },
    lastLogin: new Date()
  };
};

/**
 * Salva o dispositivo atual na lista de dispositivos conhecidos
 */
export const saveCurrentDevice = (userId: string): void => {
  const currentDevice = getCurrentDeviceInfo();
  const storageKey = `${DEVICE_STORAGE_KEY}_${userId}`;
  
  // Obter dispositivos conhecidos
  const storedDevices = localStorage.getItem(storageKey);
  let knownDevices: DeviceInfo[] = storedDevices ? JSON.parse(storedDevices) : [];
  
  // Verificar se este dispositivo já está na lista
  const deviceIndex = knownDevices.findIndex(device => device.deviceId === currentDevice.deviceId);
  
  if (deviceIndex >= 0) {
    // Atualizar informações do dispositivo existente
    knownDevices[deviceIndex] = {
      ...knownDevices[deviceIndex],
      lastLogin: currentDevice.lastLogin
    };
  } else {
    // Adicionar novo dispositivo
    knownDevices.push(currentDevice);
  }
  
  // Salvar dispositivos atualizados
  localStorage.setItem(storageKey, JSON.stringify(knownDevices));
};

/**
 * Verifica se o dispositivo atual é novo para o usuário
 */
export const isNewDevice = (userId: string): boolean => {
  const currentDeviceId = localStorage.getItem(CURRENT_DEVICE_KEY);
  if (!currentDeviceId) return true;
  
  const storageKey = `${DEVICE_STORAGE_KEY}_${userId}`;
  const storedDevices = localStorage.getItem(storageKey);
  if (!storedDevices) return true;
  
  const knownDevices: DeviceInfo[] = JSON.parse(storedDevices);
  return !knownDevices.some(device => device.deviceId === currentDeviceId);
};

/**
 * Obtém uma descrição amigável do dispositivo atual
 */
export const getDeviceDescription = (): string => {
  const deviceInfo = getCurrentDeviceInfo();
  let description = `${deviceInfo.browser.name} ${deviceInfo.browser.version} em ${deviceInfo.os.name} ${deviceInfo.os.version}`;
  
  if (deviceInfo.device.vendor !== 'Desconhecido') {
    description += ` (${deviceInfo.device.vendor} ${deviceInfo.device.model})`;
  }
  
  return description;
};
