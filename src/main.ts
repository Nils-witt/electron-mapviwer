import {app, BrowserWindow, dialog, Menu, net, protocol} from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {Config} from "./types/configType";


const config = new Config();


async function openMap() {
    const res = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    res.filePaths.forEach((filePath) => {
        config.maps.push({name: "Map-" + filePath, path: filePath + "/{z}/{x}/{y}.png"});
    });

    BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('sendConfig', config);
    })
}

async function openOverlay() {
    const res = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    res.filePaths.forEach((filePath) => {
        config.overlays.push({name: "Overlay-" + filePath, path: filePath + "/{z}/{x}/{y}.png"});
    });

    BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('sendConfig', config);
    });
}

async function loadConfig() {
    const res = await dialog.showOpenDialog({
        title: "Open Config",
        defaultPath: path.join(app.getPath('documents'), 'config.json'),
        properties: ['openFile']
    });
    if (res.canceled) {
        return;
    }
    const filePath = res.filePaths[0];
    config.loadFromFile(filePath);
    BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('sendConfig', config);
    });
}

const template = [
    {
        label: 'Start',
        submenu: [
            {
                label: 'Help',
                click() {
                    dialog.showMessageBox({
                        type: "info",
                        message: "This is a help message.",
                        buttons: ["OK"]
                    });
                }
            }
        ]
    },
    {
        label: 'Config',
        submenu: [
            {
                label: 'Save Config',
                click() {
                    dialog.showSaveDialog({
                        title: "Save Config",
                        defaultPath: path.join(app.getPath('documents'), 'config.json'),
                    })
                        .then((result) => {
                            console.log(result.filePath);
                            if (result.filePath) {
                                config.saveToFile(result.filePath);
                            }
                        });
                }
            },
            {
                label: 'Open Config',
                click() {
                    loadConfig();
                }
            }
        ]
    },
    {
        label: 'Maps',
        submenu: [
            {
                label: 'Add Map',
                click() {
                    openMap();
                }
            },
            {
                label: 'Add Overlay',
                click() {
                    openOverlay();
                }
            }
        ]
    }
]
const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);


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
                mainWindow.webContents.send('sendConfig', config);
            });
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
            .then(() => {
                mainWindow.webContents.send('sendConfig', config);
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
