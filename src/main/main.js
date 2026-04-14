const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// defines App's ID so Windows recognises the icon in Taskbar
app.setAppUserModelId("com.hammysden.app");

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 550,
    useContentSize: true,
    resizable: false,       // disables stretching the screen
    maximizable: false,     // disables the maximize button
    fullscreenable: false,  // disables fullscreen
    frame: false,           // disables the default upper bar
    transparent: true,      // for the transparent corners

    icon: path.join(process.cwd(), 'src/renderer/assets/app-icon.ico'), // icon image

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  });

  win.loadURL('http://localhost:5173/'); // points to the Vite dev server
}

app.whenReady().then(createWindow);

// close app if no windows are open
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// minimize window
ipcMain.on('minimize-app', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});
