
/** フッター領域 */
const footerArea = document.querySelector(".footer");

// 読込
document.querySelector("#btnOpen").addEventListener("click", () => {
  loadFile();
});
// 保存
document.querySelector("#btnSave").addEventListener("click", () => {
  saveFile();
});

// 投稿
document.querySelector("#btnPost").addEventListener("click", async () => {
  let text = document.getElementById("log-text").value
  let tarP = document.getElementById("log-target").value
  let tar = document.getElementById("log-type").value
  let proj = document.getElementById(tagSelProj)
  let dir = document.getElementById(tagSelProj).value

  let proj_t = proj.options[proj.selectedIndex].text;
  console.log(text)
  console.log(tarP)
  console.log(tar)
  console.log(proj_t)
  console.log(dir)
  if (text.length < 3) {
    alert("too short text.")
    return;
  }
  const result = await window.myApp.post({ path: currentPath, text: text, direction: tar, person: tarP, project: proj_t });
  console.log(result)
  if (result) {
    const { fname, textData } = result;
    document.getElementById("log-text").value = ""
    console.log(fname)
    console.log(textData)
    editor.setValue(textData, -1);
    editor.renderer.scrollToLine(Number.POSITIVE_INFINITY)
    currentFile = fname;
    footerArea.textContent = fname;
  }
  console.log("post");
});


document.querySelector("#newProj").addEventListener("click", async () => {
  let input = document.getElementById("inputProj")
  let path = document.getElementById("inputPath")
  const result = await window.myApp.addProj(input.value, path.value);
});


document.getElementById("ProjDelBtn").addEventListener("click", async () => {
  if (confirm(value + " を削除しますか？")) {
    let elm = document.getElementById(tagSelProj)
    const result = await window.myApp.delProj(elm.text);
  }
});

document.getElementById("getPath").addEventListener("click", async () => {
  const result = await window.myApp.getPath();
  let elm = document.getElementById("inputPath")
  elm.value = result;

});


document.getElementById("getDefPath").addEventListener("click", async () => {
  const result = await window.myApp.getDefPath();
  let elm = document.getElementById("inputDefPath")
  elm.value = result;
});

document.querySelector("#saveDefPath").addEventListener("click", async () => {
  let path = document.getElementById("inputDefPath")
  footerArea.textContent = currentPath = path.value;
  let author = document.getElementById("inputAuthor")
  const result = await window.myApp.setSystem(path.value, author.value);

});


// Text Editor (ace)
const editor = ace.edit("inputArea");
editor.setTheme("ace/theme/twilight");

// ファイルパスのステート
let currentPath = null;
let currentFile = null;
async function loadFile() {
  const result = await window.myApp.loadFile();
  if (result) {
    const { filePath, text } = result;
    footerArea.textContent = currentPath = filePath;
    editor.setValue(text, -1);
    editor.renderer.scrollToLine(Number.POSITIVE_INFINITY)
  }
}

async function saveFile() {
  console.log(editor)
  const result = await window.myApp.saveFile(currentFile, editor.getValue());
  if (result) {
    footerArea.textContent = currentPath = result.filePath;
  }
}


var tagSelProj = "sel-project";
window.myApp.onProjectsChanged((projs) => {
  onResetSelect(tagSelProj, projs);
});

function resetSelProj(options) {
  onResetSelect(tagSelProj, options);
}

window.myApp.onPathChanged((path) => {
  console.log(path)
  let elm = document.getElementById("inputDefPath")
  elm.value = path;
  footerArea.textContent = currentPath = path;
});

window.myApp.onEditorChanged((data) => {
  console.log(data.text)
  editor.setValue(data.text, -1);
  editor.renderer.scrollToLine(Number.POSITIVE_INFINITY)
  currentFile = data.fname;
  footerArea.textContent = data.fname;
});



function onResetSelect(tagID, options) {
  const select = document.getElementById(tagID);
  select.innerHTML = "";
  //for (let i = 0; i < options.length; i++) {
  for (let i in options) {
    const option = document.createElement('option');
    option.value = options[i]
    option.text = i;
    select.appendChild(option);
  }
}


/*
async function addProj() {
  let input = document.querySelector("#inputProj")
  console.log(input)
  console.log(input.getValue())
  const result = await window.myApp.addProj(input.getValue());
  console.log(result)
}
*/


// ---------------------------------------
// ドラッグ&ドロップ関連処理（任意実装）
// ---------------------------------------

// dropはdragoverイベントを登録していてはじめて発火するため指定
document.addEventListener("dragover", (event) => {
  event.preventDefault();
});
// ドロップされたらそのファイルを読み込む
document.addEventListener("drop", (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];

  // FileReader 機能を使って読み込み。
  // メインプロセス側で処理を統一してもいいかもですが、代案として例示します。
  const reader = new FileReader();
  reader.onload = function () {
    const textData = reader.result;

    // フッター部分に読み込み先のパスを設定する
    footerArea.textContent = currentPath = file.path;
    // テキスト入力エリアに設定する
    editor.setValue(textData, -1);
  };
  reader.readAsText(file); // テキストとして読み込み
});
