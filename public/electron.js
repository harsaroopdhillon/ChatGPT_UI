const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const globalShortcut = electron.globalShortcut

let mainWindow;
let shown = false;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 620,
    height: 410,
    frame: false,
	maximizable: false,
	minimizable:false,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
      enableRemoteModule: true,
      devTools: isDev,
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.setResizable(true);
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.focus();
  shown = true;
}

app.on("ready", createWindow);
app.whenReady().then(() => {
  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+Shift+R', () => {
		if(shown){
			mainWindow.hide();
			shown = false;
		}
		else{
			mainWindow.show();
			shown = true;
			
		}

  })

  if (!ret) {
    console.log('registration failed')
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('CommandOrControl+Shift+R'))
})

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+Shift+R')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
