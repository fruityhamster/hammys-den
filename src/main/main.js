import { app, BrowserWindow, ipcMain } from 'electron';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import bcrypt from 'bcrypt';

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

// for button exit app (closes app)
ipcMain.on('force-close', () => {
  app.quit();
});

// minimize window
ipcMain.on('minimize-app', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

const prisma = new PrismaClient();

// TO-DO LIST
// add tasks
ipcMain.handle('add-task', async (event, taskData) => {
  return await prisma.task.create({
    data: taskData
  });
});

// load tasks
ipcMain.handle('get-tasks', async (event, userId) => {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { position: 'asc' }
  });
});

// update task (check)
ipcMain.handle('update-task', async (event, { id, data }) => {
  return await prisma.task.update({
    where: { id: id },
    data: data
  });
});

// delete task
ipcMain.handle('delete-task', async (event, id) => {
  return await prisma.task.delete({
    where: { id: id }
  });
});

// CALENDAR
// load calendar events
ipcMain.handle('get-events', async (event, userId) => {
  return await prisma.event.findMany({
    where: { userId: userId },
    orderBy: { startDate: 'asc' }
  });
});

// new event
ipcMain.handle('add-event', async (event, eventData) => {
  return await prisma.event.create({
    data: eventData
  });
});

// delete event
ipcMain.handle('delete-event', async (event, id) => {
  return await prisma.event.delete({
    where: { id: id }
  });
});

// update task (check)
ipcMain.handle('update-event', async (event, { id, data }) => {
  return await prisma.event.update({
    where: { id: id },
    data: data
  });
});

// TIMER
// save/add session
ipcMain.handle('add-session', async (event, sessionData) => {
  const session = await prisma.TimerSession.create({
    data: {
      duration: parseInt(sessionData.duration) || 0, // not null
      recipe: sessionData.recipe,
      notes: sessionData.notes,
      // telling Prisma: "connect this session to this user ID"
      user: {connect: { id: sessionData.userId }}
    }
  });
  return session;
});

// update existing session (for History editing)
ipcMain.handle('update-session', async (event, { id, data }) => {
  return await prisma.TimerSession.update({
    where: { id },
    data: data
  });
});

// HISTORY
// get sessions history
ipcMain.handle('get-sessions', async (event, userId) => {
  try {
    return await prisma.timerSession.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' } // shows the most recents first
    });
  } catch (error) {
    console.error("Erro Prisma (get-sessions):", error);
    throw error;
  }
});

// LOGIN
// create account
ipcMain.handle('auth-signup', async (event, { name, email, password }) => {
  const saltRounds = 10;
  // generates the "hidden" password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // saves the Hash, not the real password
    },
  });
});

// login
ipcMain.handle('auth-login', async (event, { email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    // compares the written password with the saved hash
    const match = await bcrypt.compare(password, user.password);
    if (match) return user;
  }
  
  throw new Error('Access denied');
});
