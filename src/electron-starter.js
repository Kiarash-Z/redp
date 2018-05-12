const { app, BrowserWindow, Menu, dialog } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');


const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        click() {
          dialog.showOpenDialog(mainWindow, {
            properties: ['openFile', 'multiSelections'],
            filters: [
              {name: 'Audio Files', extensions: ['mp3']},
            ]
          }, filePaths => {
            if(filePaths) mainWindow.webContents.send('files:open', filePaths)
          });
        }
      },
      { label: 'Open Folder' }
    ],
  }
];
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    titleBarStyle: 'hidden',
    webPreferences: { webSecurity: false }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  // Menu
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
