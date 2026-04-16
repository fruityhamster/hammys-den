# Hammy's Den

> **Hammy's Den** is a productivity and organization desktop app that offers a cozy environment with a minimalist aesthetic based on Pixel Art. It was developed using Electron, JavaScript/React, and Vite. The app allows you to manage tasks, organize your week, time activities, and track progress.

## Inspiration

During high school time, I experienced firsthand the challenge of maintaining focus and organization amidst so many subjects and deadlines. Back then, having a tool where I could organize tasks and time my study sessions in one place would have made all the difference.

The visual idea and the final push came from content creators on YouTube. They showed me that a work tool could be a pleasant and visually comforting space. That's how the concept of "Hammy" came about: a pixelated companion that transforms the study routine into a welcoming environment.

---

## Technology Used

- [React.js](https://reactjs.org/) - Interface library.
- [Electron](https://www.electronjs.org/) - Framework for desktop apps.
- [Vite](https://vitejs.dev/) - Build tool.
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) - Layouts with Grid and Flexbox.

---

## Functionalities

- **Dashboard Modular:** Intuitive interface for quick access to all tools.
- **To-Do List:** Task management.
- **Calendar:** Real-time widget that automatically updates at midnight, displaying the current date. Allows monthly viewing and adding future appointments.
- **Timer:** Pomodoro Timer (goes up to 60 minutes) to help focus on tasks.
- **History:** History of focus sessions. Allows viewing past sessions and what was done in each one.

---

## Project Structure

```
electron-app-template
├── node_modules/
├── src/
│   ├── main/                   # Electron main process
│   │   └── main.js             # Window management and OS-level logic
│   ├── renderer/               # React Frontend Process (UI)
│   │   ├── assets/             # Pixel Art sprites and icons
│   │   ├── components/         # Functional UI components
│   │   │   ├── Calendar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Timer.jsx
│   │   │   └── TodoList.jsx  
│   │   └── pages/
│   │       └── App.jsx         # Main router and state management
│   ├── main.jsx                # React entry point (mounting the app)
│   └── styles.css              # Global styles (CSS) and Pixel Art design variables
├── index.html                  # HTML template for the renderer process and React root container
├── package-lock.json
├── package.json                # App metadata, scripts, and dependencies
└── vite.config.js              # Vite bundler configuration
```

---

## How to Launch App

Before using this repository, make sure you have:
- Node.js - you can download directly from https://nodejs.org and follow their installation instructions.
- A code editor (Visual Studio Code)

### Step by Step Set Up
1. Clone this repository:
```bash
git clone https://github.com/fruityhamster/hammys-den.git
```
2. Enter the folder:
```bash
cd hammys-den
```
3. Install dependencies:
```bash
npm install
```
4. Verify installation:
```bash
node -v
npm -v
```
If both commands return version numbers, you’re good to go 

5. Execute app:
```bash
npm run start
```

This will launch the Electron desktop window.
Now you can enjoy organising and focusing in the company of your adorable hammy! <3