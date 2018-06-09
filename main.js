const electron = require('electron');
const url = require('url');
const path = require('path');

require('electron-reload')(__dirname);

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'quit' },
      { role: 'reload' },
    ],
  },
];

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    backgroundColor: '#14181C',
    height: 800,
    width: 1280,
    // fullscreen: true,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file',
    slashes: true,
  }));

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  Menu.setApplicationMenu(mainMenu);
});

if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',

    submenu: [{
      label: 'Toggle DevTools',
      accelerator: 'Cmd+I',
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      },
    }],
  });
}
