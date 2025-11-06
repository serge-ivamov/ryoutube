// main.js
const { app, BrowserWindow, BrowserView, Menu, MenuItem } = require('electron');
const path = require('path');

const startURL = 'https://serge-ivamov.github.io/ryoutube-home/';

function createWindow() {
  const navbarHeight = 60;
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  }); // BrowserWindow()

  win.loadFile('html/index.html');
  
  const view = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true 
    }
  }); // BrowserView()
  
  win.setBrowserView(view);
  view.webContents.loadURL(startURL);
  const { ipcMain } = require('electron');

  ipcMain.on('navigate', (event, url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) { url = 'https://' + url; }
    view.webContents.loadURL(url);
  });
  ipcMain.on('back', () => {
    if (view.webContents.navigationHistory.canGoBack()) { view.webContents.navigationHistory.goBack(); }
  });
  ipcMain.on('forward', () => {
    if (view.webContents.navigationHistory.canGoForward()) { view.webContents.navigationHistory.goForward(); }
  });
  ipcMain.on('reload', () => { view.webContents.reload(); });
  ipcMain.on('stop', () => { view.webContents.stop(); });
  ipcMain.on('go-youtube', () => { view.webContents.loadURL('https://www.youtube.com'); });
  // Обновляем строку URL в интерфейсе при навигации
  view.webContents.on('did-navigate', (event, url) => { win.webContents.send('update-url', url); });
  view.webContents.on('did-finish-load', () => { win.webContents.send('update-url', view.webContents.getURL()); });

  // Определяем размеры и положение BrowserView
  const resizeView = () => {
    const { width, height } = win.getBounds();
    if (win.isFullScreen()) { view.setBounds({ x: 0, y: 0, width: width, height: height }); }
    else { view.setBounds({ x: 0, y: navbarHeight, width: width, height: height - navbarHeight }); }
  };

  // Обработчик изменения размеров окна для обновления размеров view
  win.on('resize', resizeView);
  resizeView();

  // Обработчик полноэкранного режима
  win.on('enter-full-screen', () => {
    win.webContents.send('toggle-nav', false);
    const { width, height } = win.getBounds();
    view.setBounds({ x: 0, y: 0, width: width, height: height }); 
  });

  win.on('leave-full-screen', () => {
    win.webContents.send('toggle-nav', true);
    const { width, height } = win.getBounds();
    view.setBounds({ x: 0, y: navbarHeight, width: width, height: height - navbarHeight }); 
  });

} // createWindow()

function addAboutMenuItem() {
  const currentMenu = Menu.getApplicationMenu();
  if (!currentMenu) { console.error('No menu.'); return; }
  let helpMenu = currentMenu.items.find(item => {
    return item.role === 'help' || item.label === 'Помощь' || item.label === 'Help';
  });
  if (!helpMenu) {
    helpMenu = new MenuItem({ label: 'Помощь', submenu: [] });
    currentMenu.items.push(helpMenu);
  }
  helpMenu.submenu.append(new MenuItem({ label: 'О программе', role: 'about' }));
  Menu.setApplicationMenu(currentMenu);
} // addAboutMenuItem()

app.whenReady().then(() => {
  const { app } = require('electron');
  app.commandLine.appendSwitch('no-proxy-server');
  if (process.platform == 'darwin') { // Tahoe bug workaround.
    app.commandLine.appendSwitch('proxy-server');
    app.commandLine.appendSwitch('headless');
  }
  if (process.platform == 'win32') { addAboutMenuItem(); } // Добавляем пункт "О программе" в подменю "Помощь"
  createWindow();
}); // app.whenReady()


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); // app.on()

