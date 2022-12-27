const { app, globalShortcut, BrowserWindow, TouchBar, ipcMain, shell } = require('electron');
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;
const path = require('path');
// 引入modules里的功能
const fileOperator = require('./modules/file-operator');
const { fileOperateType } = require('./modules/enums');
const winOperator = require('./modules/window-operator');
const { warning, save, info } = require('./modules/modal');
const deffer = require('./modules/deffer');
const { transform2Promise } = require('./modules/util');
const { touchBar, updateTouchBarLabel } = require('./modules/touch-bar-operator');

// https://raw.githubusercontent.com/Y-WMS-FE/electron-down/master/update.json

const isDev = /--dev/.test(process.argv[2]);

let isQuit = 0;
// Reel labels
// const reel1 = new TouchBarLabel()
// const reel2 = new TouchBarLabel()
// const reel3 = new TouchBarLabel()
//
// const welcomeLabel = new TouchBarLabel();
//
//
// welcomeLabel.label = ' 欢迎使用 ';
// welcomeLabel.textColor = null;

// create button
// const createBtn = new TouchBarButton({
//   label: '新建',
//   click: () => {
//     console.log('click "新建" touchBar button');
//   }
// });
//
// const saveBtn = new TouchBarButton({
//   label: '保存',
//   click: async () => {
//     console.log('click "保存" touchBar button');
//   }
// });

async function saveDialog() {
  return save({
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'Plain Text', extensions: ['txt'] },
    ]
  });
}

async function saveFile(filePath, fileText) {
  if (!filePath) {
    filePath = await saveDialog();
    fileOperator.setFilePath(filePath);
  }
  return fileOperator.writeFile(filePath, fileText);
}

// const touchBar = new TouchBar({
//   items: [
//     createBtn,
//     new TouchBarSpacer({ size: 'large' }),
//     saveBtn,
//     new TouchBarSpacer({ size: 'large' }),
//     welcomeLabel,
//   ]
// });

// 声明win contents

function createWindow() {
  const position = winOperator.getWinPosition();
  const win = new BrowserWindow({
    width: 550,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#ffffff',
    titleBarStyle: 'hiddenInset',
    resizable: false,
    ...position,
  });
  winOperator.addWin(win, position);
  const { webContents } = win;
  if (isDev) {
    win.loadURL('http://localhost:9899');
    // webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'assets', 'index.html'));
  }
  // win.setTouchBar(touchBar);
  win.on('close', (e) => {
    e.preventDefault();
    webContents.send('before-close');
  });
  win.on('closed', () => {
    winOperator.removeWin(win);
  });
  win.on('show', () => {
    win.setTouchBar(touchBar);
  });
  win.on('page-title-updated', (e, title) => {
    if (win.isFocused()) {
      updateTouchBarLabel(title);
    }
  });
  win.on('focus', (event) => {
    updateTouchBarLabel(win.getTitle());
  });
  return win;
}

// app.setAsDefaultProtocolClient()
app.on('window-all-closed', () => {
  console.log(process.platform);
  // app.clearRecentDocuments()
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const { webContents: { id } } = await createWindow();
    return { webContentsId: id };
  }
});

app.on('before-quit', () => {
  isQuit = winOperator.getWinNum();
});

app.on('open-file', async (e, filePath) => {
  e.preventDefault();
  const { base: fileName, ext } = path.parse(filePath);
  if (ext === '.md') {
    if (winOperator.getWinNum() >= 5) {
      await warning({
        message: '您打开了太多的窗口！',
        detail: '请关闭一些不需要的窗口。',
      });
      return console.log('窗口太多');
    }
    const { webContents } = await createWindow();
    await transform2Promise(webContents.on.bind(webContents), 'did-finish-load', () => {});
    const fileText = fileOperator.readFile(filePath);
    webContents.send('rendMDE', {
      fileName,
      filePath,
      fileText,
    })
  }
});

ipcMain.on('log', (event, info) => {
  console.log(info, '-----');
})

ipcMain.on('pre-close', async (event, {
  filePath, fileText, editStatus, fileName
}) => {
  // 如果状态是"已编辑"
  if (editStatus === 1) {
    const r = info({
      message: `你要保存"${fileName || '未命名'}"的修改吗？`,
      detail: '如果不保存，修改就会丢失。',
      buttons: ['保存', '不保存', '取消'],
      cancelId: 2,
      defaultId: 0,
      noLink: true
    });
    if (r === 0) {
      const info = await saveFile(filePath, fileText);
      filePath = info.filePath;
    } else if (r === 2) {
      event.returnValue = false
      isQuit = 0;
      return;
    }
  }
  // 触发了"退出"事件，并且是最后一个
  if (isQuit > 0 && isQuit-- === 1) {
    app.exit();
    console.log('do');
  }
  fileOperator.removeFilePath(filePath);
  event.sender.destroy();
})

ipcMain.handle('ondragstart', (event, filePath) => {
  return fileOperator.setFilePath(filePath);
});

ipcMain.on('save', async (event, filePath, fileText) => {
  const info = await saveFile(filePath, fileText);
  let r = {
    code: '0',
    info: {
      fileName: info.fileName,
      filePath: info.filePath,
    },
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
  event.returnValue = r;
});

ipcMain.handle('window-open', async (event) => {
  if (winOperator.getWinNum() >= 5) {
    await warning({
      message: '您打开了太多的窗口！',
      detail: '请关闭一些不需要的窗口。',
    });
    return console.log('窗口太多');
  }
  const { webContents } = await createWindow();
  await transform2Promise(webContents.on.bind(webContents), 'did-finish-load', () => {});
  return {
    webContentsId: webContents.id,
  };
});

app.whenReady().then(createWindow);
