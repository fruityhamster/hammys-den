# Hammy's Den

> **Hammy's Den** is a productivity and organization desktop app that offers a cozy environment with a minimalist aesthetic based on Pixel Art. It was developed using Electron, JavaScript/React, and Vite. The app allows you to manage tasks, organize your week, time activities, and track progress.

## Inspiration

During high school time, I experienced firsthand the challenge of maintaining focus and organization amidst so many subjects and deadlines. Back then, having a tool where I could organize tasks and time my study sessions in one place would have made all the difference.

The visual idea and the final push came from content creators on YouTube. They showed me that a work tool could be a pleasant and visually comforting space. That's how the concept of "Hammy" came about: a pixelated companion that transforms the study routine into a welcoming environment.

---

## Technology Used

... Electron, React, Vite, CSS Grid/Flexbox.
- [React.js](https://reactjs.org/) - Biblioteca para a interface.
- [Electron](https://www.electronjs.org/) - Framework para apps desktop.
- [Vite](https://vitejs.dev/) - Build tool ultra-rápida.
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) - Layouts com Grid e Flexbox.

---

## Functionalities

... Listar o Calendário dinâmico, To-do list, etc.
- **Dashboard Modular:** Interface intuitiva para acesso rápido a todas as ferramentas.
- **Calendário Dinâmico:** Widget em tempo real que atualiza automaticamente à meia-noite, exibindo a data atualizada sobre um design temático.
- **To-Do List:** Gestão eficiente de tarefas (em desenvolvimento).
- **Estética Customizada:** Interface 100% personalizada com CSS, incluindo efeitos 3D nos botões e tipografia Pixel Art.
- **Multiplataforma:** Graças ao Electron, funciona em Windows, macOS e Linux.

---

## Project Structure

```
electron-app-template
├── node_modules/
├── src/
│   ├── main.jsx                
│   ├── styles.css              # CSS Global e variáveis de cor. Styles for your app UI, including draggable window behavior.
│   ├── main/                   # Electron’s main process
│   │   └── main.js             # Creates e gere the app window, e ciclo de vida da app, and loads the HTML file.
│   └── renderer/               # frontend em React
│       ├── assets/             # ícone e imagens em Pixel Art
│       ├── components/         # componentes modulares (Dashboard, Calendar, etc.)
│       │   ├── Calendar.jsx
│       │   ├── Dashboard.jsx
│       │   ├── History.jsx
│       │   ├── Login.jsx
│       │   ├── Timer.jsx
│       │   └── TodoList. jsx  
│       └── pages/
│           └── App.jsx         # roteamento e lógica principal
├── index.html                  # the main UI layout of the desktop app
├── package-lock.json
├── package.json                # dependências e scripts de execução. App configuration, dependencies, and run scripts.
└── vite.config.js              # configuração de build do Vite
```

---

## How to Launch App

... pre-requisites + Instruções do `npm install` e `npm run start`.
Before using this template, make sure you have:

- **Node.js**
- **Homebrew** (macOS)
- A code editor (VS Code recommended)

Step by step set up

### 1. Install Package Managers (if you don’t have one on your computer)

MacOS: Homebrew ([https://brew.sh](https://brew.sh/))

Window: Chocolatey (https://chocolatey.org/install)

### 2. Install Node.js

You can install Node.js in two ways:

### Option A: Use a package manager (mine is Homebrew which I used in the tutorial)

```bash
brew install node
```

Verify installation:

```bash
node -v
npm -v
```

If both commands return version numbers, you’re good to go 

### Option B: Download Installer

Download Node.js directly from: https://nodejs.org

and follow their installation instructions.


### 3. Clone This Repo

```bash
gitclone https://github.com/nasha-wanich/electron-app-template.git
cd electron-app-template
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the App

```bash
npm run start
```

This will launch a simple Electron desktop window.

## 💻 Como Executar

1. Clone o repositório:
   ```bash
   git clone [https://github.com/teu-utilizador/hammys-den.git](https://github.com/teu-utilizador/hammys-den.git)

   install dependencies:
   npm install

   execute app:
   npm run start