
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  onMenuNewProject: (callback: () => void) => ipcRenderer.on('menu-new-project', callback),
  onMenuExportData: (callback: () => void) => ipcRenderer.on('menu-export-data', callback),
  
  // File system operations
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  saveFile: (data: any, filename: string) => ipcRenderer.invoke('save-file', data, filename),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path')
});
