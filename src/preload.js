const { contextBridge, ipcRenderer, ipcMain } = require("electron");


// レンダラープロセスのグローバル空間(window)にAPIとしての関数を生やします。
// レンダラープロセスとメインプロセスの橋渡しを行います。
contextBridge.exposeInMainWorld("myApp", {
  /**
   * 【プリロード（中継）】ファイルを開きます。
   * @returns {Promise<{filePath: string, textData:string}>}
   */
  async loadFile() {
    // メインプロセスの関数を呼び出す
    const result = await ipcRenderer.invoke("loadFile");
    return result;
  },

  /**
   * 【プリロード（中継）】ファイルを保存します。
   * @param {string} currentPath 現在編集中のファイルのパス
   * @param {string} textData テキストデータ
   * @returns {Promise<{filePath: string} | void>}
   */
  async saveFile(currentPath, textData) {
    // メインプロセスの関数を呼び出す
    const result = await ipcRenderer.invoke("saveFile", currentPath, textData);
    return result;
  },

  async post(currentPath, postData) {
    // メインプロセスの関数を呼び出す
    const result = await ipcRenderer.invoke("post", currentPath, postData);
    return result;
  },


  async delProj(name) {
    console.log("delete " + name)
    const result = await ipcRenderer.invoke("delProj", name);
    return result;
  },

  async getPath() {
    const result = await ipcRenderer.invoke("getPath");
    return result;
  },

  async getDefPath() {
    const result = await ipcRenderer.invoke("getDefPath");
    return result;
  },

  async setSystem(path, author) {
    const result = await ipcRenderer.invoke("setSystem", path, author);
    return result;
  },

  async addProj(name, path) {
    console.log("add " + name)
    const result = await ipcRenderer.invoke("addProj", name, path);
    return result;
  },

  onPathChanged: (callback) => {
    ipcRenderer.on('path-changed', (_, data) => callback(data));
  },

  onProjectsChanged: (callback) => {
    ipcRenderer.on('projects-changed', (_, data) => callback(data));
  },

  onEditorChanged: (callback) => {
    ipcRenderer.on('editor-changed', (_, data) => callback(data));
  },
});



