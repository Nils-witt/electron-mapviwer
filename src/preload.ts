// Import the necessary Electron modules

import {contextBridge, ipcRenderer} from 'electron';
// Exposed protected methods in the render process
contextBridge.exposeInMainWorld(
    'bridge', {
        sendBaseLayer: (message: any) => {
            ipcRenderer.on('sendBaseLayer', message);
        },
        sendOverlayLayer: (message: any) => {
            ipcRenderer.on('sendOverlayLayer', message);
        },
        sendMessage: (message: any) => {
            ipcRenderer.on('sendMessage', message);
        }
    }
);