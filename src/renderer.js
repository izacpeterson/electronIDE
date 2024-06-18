/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

let workingDirectory = "";
let openFile = "";

console.log('👋 This message is being logged by "renderer.js", included via Vite');
console.log(api.title);

if (localStorage.getItem("lastOpen")) {
  console.log("Folder open");
  let result = JSON.parse(localStorage.getItem("lastOpen"));
  console.log(result);

  localStorage.setItem("lastOpen", JSON.stringify(result));

  document.querySelector("#fileList").innerHTML = "";

  document.querySelector("#directory").innerHTML = result.directoryPath;
  workingDirectory = result.directoryPath;
  result.files.forEach((file) => {
    document.querySelector("#fileList").innerHTML += `<li class="hover:bg-blue-500 hover:text-white" data-file="${file}">${file}</li>`;
  });
}

document.querySelector("#openFolder").addEventListener("click", async () => {
  let result = await api.openDirectory();
  console.log(result);

  localStorage.setItem("lastOpen", JSON.stringify(result));

  document.querySelector("#fileList").innerHTML = "";

  document.querySelector("#directory").innerHTML = result.directoryPath;
  workingDirectory = result.directoryPath;
  result.files.forEach((file) => {
    document.querySelector("#fileList").innerHTML += `<li class="hover:bg-blue-500 hover:text-white" data-file="${file}">${file}</li>`;
  });
});

document.querySelector("#fileList").addEventListener("click", async (event) => {
  if (event.target && event.target.nodeName === "LI") {
    let file = event.target.getAttribute("data-file");
    openFile = file;
    let result = await api.openFile(workingDirectory + "\\" + file);
    document.querySelector("#textEditor").value = result;
    document.querySelector("#textEditor").classList.remove("hidden");
    document.querySelector("#fileName").innerHTML = file;
  }
});

function saveFile() {
  let fileContent = document.querySelector("#textEditor").value;
  let path = workingDirectory + "\\" + openFile;
  let file = { path: path, content: fileContent };

  api.saveFile(file);
}

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault();
    saveFile();
  }
});
