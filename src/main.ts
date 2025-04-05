import {app, BrowserWindow, net, protocol} from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

function getOverlaysFromArgs(): { name: string; path: string; }[] {
    const overlays: { name: string; path: string; }[] = [];
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i].startsWith("--overlay=")) {
            const overlayPath = process.argv[i].substring(10);
            overlays.push({name: "Overlay-" + i, path: overlayPath});
        }
    }
    return overlays
}

function getMapsFromArgs(): { name: string; path: string; }[] {
    const maps: { name: string; path: string; }[] = [];
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i].startsWith("--map=")) {
            const overlayPath = process.argv[i].substring(6);
            maps.push({name: "Map-" + i, path: overlayPath});
        }
    }
    return maps
}

if (started) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),    
        },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
            .then(() => { 
                mainWindow.webContents.send('sendBaseLayer', getMapsFromArgs()); 
                mainWindow.webContents.send('sendOverlayLayer', getOverlaysFromArgs());
                mainWindow.webContents.send('sendMessage', process.argv);
            });
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
            .then(() => {
                mainWindow.webContents.send('sendBaseLayer', getMapsFromArgs());
                mainWindow.webContents.send('sendOverlayLayer', getOverlaysFromArgs());
                mainWindow.webContents.send('sendMessage', process.argv);
            });
    }
};

app.on('ready', () => {
    protocol.handle('my-protocol', async (request) => {
        try {
            const filePath = request.url
                .replace(`my-protocol://`, 'file://')

            return net.fetch(filePath);
        } catch (e) {
            console.error("Error in protocol handler", e);
        }

    });

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
