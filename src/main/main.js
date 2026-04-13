const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 550,
    useContentSize: true,
    resizable: false,       // Impede o utilizador de esticar a janela
    maximizable: false,     // Desativa o botão de maximizar
    fullscreenable: false,  // Impede que entre em ecrã total
    frame: false,           // Mantém a barra superior (ou false se quiseres tirar)
    transparent: true,      // Permite que os cantos arredondados funcionem
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL('http://localhost:5173/'); // Aponta para o Vite dev server
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});