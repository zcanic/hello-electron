import { contextBridge } from 'electron';

// Expose a noop API so the renderer stays isolated without Node integration.
contextBridge.exposeInMainWorld('electronAPI', {});
