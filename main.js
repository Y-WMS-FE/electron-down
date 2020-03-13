const { app, BrowserWindow, TouchBar, ipcMain, dialog } = require('electron');
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;

const fileOperator = require('./modules/file-operator');
const { fileOperateType } = require('./modules/enums');

// Reel labels
const reel1 = new TouchBarLabel()
const reel2 = new TouchBarLabel()
const reel3 = new TouchBarLabel()

const welcomeLabel = new TouchBarLabel();

welcomeLabel.label = ' 欢迎使用 ';
welcomeLabel.textColor = null;

// create button
const createBtn = new TouchBarButton({
  label: '新建',
  click: () => {
    console.log('click "新建" touchBar button');
  }
});

const saveBtn = new TouchBarButton({
  label: '保存',
  click: async () => {
    console.log('click "保存" touchBar button');
    // await saveDialog();
  }
});
async function saveDialog() {
  return dialog.showSaveDialogSync({
    properties: ['openDirectory', 'createDirectory'],
    filters: [
      { name: 'Markdown', extensions: ['md']},
      { name: 'Plain Text', extensions: ['txt']},
    ]
  });
}

async function saveFile(filePath, fileText) {
  console.log(filePath);
  if (!filePath) {
    filePath = await saveDialog();
  }
  return fileOperator.writeFile(filePath, fileText);
}

const touchBar = new TouchBar({
  items: [
    createBtn,
    new TouchBarSpacer({ size: 'large' }),
    saveBtn,
    new TouchBarSpacer({ size: 'large' }),
    welcomeLabel,
  ]
});

// 声明win contents
let win, contents;

function createWindow() {
  win = new BrowserWindow({
    width: 550,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
    backgroundColor: '#ffffff',
    titleBarStyle: 'hiddenInset',
    resizable: false,
  });
  win.loadURL('http://localhost:9899');
  contents = win.webContents;
  contents.openDevTools();
  win.setTouchBar(touchBar)
}

app.on('window-all-closed', () => {
  console.log(process.platform, 'now is');
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    fileOperator.cleanCache();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('open-file', (e, filePath) => {
  e.preventDefault();
  console.log(1111);
  console.log(e, filePath);
  if (win) {
    win.send('open-file', filePath);
  }
});

ipcMain.on('ondragstart', (event, filePath) => {
  console.log(filePath);
  fileOperator.setFilePath(filePath);
  // event.sender.startDrag({
  //   file: filePath,
  //   icon: '/path/to/icon.png'
  // })
});

ipcMain.handle('save', async (event, filePath, fileText) => {
  const info = await saveFile(filePath, fileText);
  let r = {
    code: '0',
    info,
    msg: '保存成功'
  };
  switch (info.status) {
    case fileOperateType.SUCCESS:
      break;
    case fileOperateType.NULL:
      r.code = '1';
      r.msg = '路径不存在';
      break;
    case fileOperateType.ERROR:
      r.code = '1';
      r.msg = '保存失败';
      break;
    default:
      break;
  }
  return r;
});

app.whenReady().then(createWindow);
