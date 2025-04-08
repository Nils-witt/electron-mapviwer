import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld(
    'bridge', {
        sendConfig: (message: never) => {
            ipcRenderer.on('sendConfig', message);
        }
    }
);