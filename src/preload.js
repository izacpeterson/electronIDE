// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  title: "Izac Editor",
  createNote: (data) => ipcRenderer.invoke("create-file", data),
  openDirectory: async () => {
    let result = await ipcRenderer.invoke("open-dir");
    return result;
  },
  openFile: async (file) => {
    let result = await ipcRenderer.invoke("open-file", file);
    return result;
  },
  saveFile: async (file) => {
    ipcRenderer.invoke("save-file", file);
  },
});
