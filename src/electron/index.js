const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const { promisify } = require('bluebird');
const readdirAboslute = require('readdir-absolute');

const readdir = promisify(readdirAboslute);

const { APP_NAME, SIZE, MAX_SIZE, MIN_SIZE } = require('../constants/appConstants');

app.setName(APP_NAME);

const openDialog = () => {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'openFile', 'multiSelections'],
    filters: [
      {name: 'Audio Files', extensions: ['mp3']},
    ]
  }, filePaths => {
    if (!filePaths) return;
    const paths = filePaths.map(path => {
      if(fs.lstatSync(path).isDirectory()) return readdir(path);
      return Promise.resolve(path);
    });
    Promise.all(paths).then(values => {
      const filteredPaths = values
        .reduce((a, b) => {
          if (Array.isArray(a)) return a.concat(b);
          return [a].concat(b);
        })
        .filter(path => path.endsWith('.mp3'));
        mainWindow.webContents.send('files:open', filteredPaths);
    });
  });
}

// Menu
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        click() {
          openDialog();
        },
        accelerator: process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O',
      }
    ],
  }
];
if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about'},
      { type: 'separator'},
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      },
    ]
  })
}

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: SIZE.width,
    height: SIZE.height,
    titleBarStyle: 'hidden',
    webPreferences: { webSecurity: false }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => { mainWindow = null });
  mainWindow.setMinimumSize(MIN_SIZE.width, MIN_SIZE.height);
  mainWindow.setMaximumSize(MAX_SIZE.width, MAX_SIZE.height);
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

if (isDev) {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      { role: 'reload' }
    ]
  })
}

// open dialog from the app
ipcMain.on('dialog:open', openDialog);

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate',() => {
  if (mainWindow === null) {
    createWindow()
  }
});
