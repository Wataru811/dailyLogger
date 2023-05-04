// アプリケーション作成用のモジュールを読み込み
const path = require("path");
const fs = require("fs");
const electron = require("electron");
const app = electron.app;
const { BrowserWindow, ipcMain, dialog, Tray, Menu, nativeImage, nativeTheme } = electron;
const Global = require('./global.js');
const DEBUG = true;
//const electronLog = require('electron-log');
const Store = require('electron-store');  // store 
const store = new Store({ cwd: "electron-editor.config.json" });


var global = new Global();   // create and restore from config
loadSettings();

function loadSettings() {
  console.log(store.get('projects', {}));
  global.projs = store.get('projects', {});
  global.author = store.get('author', "");
  global.path = store.get('path', "~/.electron-user/");

}

function saveSettings() {
  store.set('projects', global.projs)
  store.set('path', global.path)
  store.set('author', global.author)

}


// ---------------- Tray ----------------------------
let tray = null;
const createTrayIcon = () => {
  let imgFilePath;
  console.log(process.platform);
  if (process.platform === 'win32') { // Windows
    imgFilePath = __dirname + '/app.ico';
  }
  else { // macOS or linux
    imgFilePath = __dirname + '/app.png';
    // 一応、macOS のダークモードに対応しておく
    if (nativeTheme.shouldUseDarkColors === true) {
      isDarkTheme = true;
      imgFilePath = __dirname + '/app.png';
    }
  }
  const contextMenu = Menu.buildFromTemplate([
    { label: '終了', role: 'quit' }
  ]);
  console.log("create tray0 " + imgFilePath)
  const icon = nativeImage.createFromPath(imgFilePath);
  console.log(icon.getBitmap())
  const trayIcon = icon.resize({ width: 16 });
  trayIcon.setTemplateImage(true);
  tray = new Tray(trayIcon);
  console.log(tray)

  tray.setToolTip(app.name);
  tray.setContextMenu(contextMenu);
  console.log("create tray")
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

}

// - --- main window ---- 
let mainWindow;

function createWindow() {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({
    width: 800,
    height: DEBUG ? 540 + 580 : 540,
    webPreferences: {
      // preload.js を指定
      preload: path.join(app.getAppPath(), "./src/preload.js"),
    },
  });
  mainWindow.loadFile("./src/index.html");
  mainWindow.webContents.openDevTools();
  console.log("app start")
  mainWindow.webContents.send('projects-changed', global.getProjs());
  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
    //mainWindow = null;
  });
  app.on('closed', () => {
    if (process.platform !== 'darwin') {
      mainWindow = null;
    }
  });

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("ready to show");
    initEditor();
    mainWindow.webContents.send('projects-changed', global.getProjs());
    mainWindow.webContents.send('path-changed', global.path);
    createTrayIcon();
  });
};

function initEditor() {
  //dialog.showErrorBox("path", "文書パス:" + global.path)
  if (global.path == "") {
    dialog.showErrorBox("初期設定", "アプリ画面右上の設定ボタンから、ファイルを保存するパスを設定してください。")
    return;
  }
  let fname = getFilename(global.path);
  newFile(fname);
  // テキストファイルを読み込む
  let text = fs.readFileSync(fname, "utf8");
  mainWindow.webContents.send('editor-changed', { fname, text });
}


//  初期化が完了した時の処理
app.on("ready", createWindow);
// 全てのウィンドウが閉じたときの処理
app.on("window-all-closed", () => {
  // macOSのとき以外はアプリを終了させます
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on("activate", () => {
  /// メインウィンドウが消えている場合は再度メインウィンドウを作成する
  if (mainWindow === null) {
    createWindow();
  }
});

// レンダラープロセスとの連携
ipcMain.handle("getDefPath", getDefPath);
ipcMain.handle("setSystem", setSystem);
ipcMain.handle("getPath", getPath);
ipcMain.handle("loadFile", loadFile);
ipcMain.handle("saveFile", saveFile);
ipcMain.handle("addProj", addProj);
ipcMain.handle("delProj", delProj);
ipcMain.handle("post", post);

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getFilename(path) {
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  let dt = formatDate(new Date());
  return `${path}/log${dt}.md`
}

async function newFile(fname) {
  console.log(fname)
  if (fs.existsSync(fname)) {
    console.log("exits")
    return
  }
  let dt = formatDate(new Date());
  let textData0 = `# Daily Report  ${dt} \n\n Written by ${global.author}\n\n---\n`
  await fs.writeFileSync(fname, textData0, "utf8");
}

function createArticle(data) {
  let tm = formatTime(new Date());
  let textData1 = `\n## ${tm} ${data.project}\n`
  if (data.person != "") {
    if (data.direction == "From") {
      textData1 = textData1 + `${data.person}さんより:\n`
    }
    if (data.direction == "To") {
      textData1 = textData1 + `${data.person}さんへ:\n`
    }
  }
  return textData1 + data.text + "\n\n"
}

async function post(event, data) {
  //let dt = formatDate(new Date());
  //let tm = formatTime(new Date());
  //let fname = `${data.path}/log${dt}.md`
  let fname = getFilename(data.path);
  newFile(fname);
  let textData1 = createArticle(data);

  // テキストファイルを読み込む
  let textData = await fs.readFileSync(fname, "utf8");
  textData = textData + textData1
  await fs.writeFileSync(fname, textData, "utf8");
  return { fname, textData }
}


async function getDefPath() {
  const win = BrowserWindow.getFocusedWindow();
  const result = await dialog.showOpenDialog(
    win,
    // どんなダイアログを出すかを指定するプロパティ
    {
      properties: ["openDirectory"],
    }
  );
  console.log(result);
  if (result.filePaths.length > 0) {
    //mainWindow.webContents.send('path-changed', result.filePaths[0]);
    return result.filePaths[0]
  }
  return null;
}


async function setSystem(event, path, author) {
  console.log("set default path" + path)
  console.log(author)
  global.setSysPath(path)
  global.setSysAuthor(author)
  saveSettings();
  //mainWindow.webContents.send('path-changed', global.path);
  return { path, author };
}

async function getPath() {
  const win = BrowserWindow.getFocusedWindow();
  const result = await dialog.showOpenDialog(
    win,
    // どんなダイアログを出すかを指定するプロパティ
    {
      properties: ["openDirectory"],
    }
  );
  console.log(result);
  if (result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null;
}


/**
 * 【メインプロセス】ファイルを開きます。
 * @returns {Promise<null|{textData: string, filePath: string}>}
 */
async function loadFile() {
  const win = BrowserWindow.getFocusedWindow();

  const result = await dialog.showOpenDialog(
    win,
    // どんなダイアログを出すかを指定するプロパティ
    {
      properties: ["openFile"],
      filters: [
        {
          name: "Documents",
          // 読み込み可能な拡張子を指定
          extensions: ["txt", "html", "md", "js", "ts"],
        },
      ],
    }
  );

  // [ファイル選択]ダイアログが閉じられた後の処理
  if (result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    console.log(filePath)
    // テキストファイルを読み込む
    const textData = fs.readFileSync(filePath, "utf8");
    // ファイルパスとテキストデータを返却
    return {
      filePath,
      textData,
    };
  }
  // ファイル選択ダイアログで何も選択しなかった場合は、nullを返しておく
  return null;
}

/**
 * 【メインプロセス】ファイルを保存します。
 * @param event
 * @param {string} currentPath 現在編集中のファイルのパス
 * @param {string} textData テキストデータ
 * @returns {Promise<{filePath: string} | void>} 保存したファイルのパス
 */
async function saveFile(event, currentPath, textData) {
  let saveFilePath;

  //　初期の入力エリアに設定されたテキストを保存しようとしたときは新規ファイルを作成する
  if (currentPath) {
    saveFilePath = currentPath;
  } else {
    const win = BrowserWindow.getFocusedWindow();
    // 新規ファイル保存の場合はダイアログをだし、ファイル名をユーザーに決定してもらう
    const result = await dialog.showSaveDialog(
      win,
      // どんなダイアログを出すかを指定するプロパティ
      {
        properties: ["loadFile"],
        filters: [
          {
            name: "Documents",
            extensions: ["txt", "html", "md", "js", "ts"],
          },
        ],
      }
    );
    // キャンセルした場合
    if (result.canceled) {
      // 処理を中断
      return;
    }
    console.log(result.filePath)
    saveFilePath = result.filePath;
  }

  // ファイルを保存
  fs.writeFileSync(saveFilePath, textData);

  return { filePath: saveFilePath };
}


async function addProj(event, name, path) {
  console.log("addProj main js " + name)
  if ("" != name) {
    global.addProj(name, path);
    saveSettings();
    mainWindow.webContents.send('projects-changed', global.getProjs());
  }
  return { name: name, path: path };
}


async function delProj(event, name) {
  console.log("delete project in main.js" + name)
  if ("" != name) {
    global.delProj(name);
    saveSettings();
    mainWindow.webContents.send('projects-changed', global.getProjs());
  }
  return { name: name };
}






