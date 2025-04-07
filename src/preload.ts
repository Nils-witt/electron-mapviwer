import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld(
    'bridge', {
        sendConfig: (message: any) => {
            ipcRenderer.on('sendConfig', message);
        }
    }
);