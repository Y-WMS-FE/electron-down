const { app, BrowserWindow, TouchBar, ipcMain } = require('electron');
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

const isDev = /--dev/.test(process.argv[2]);

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
    webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'assets', 'index.html'));
  }
  // win.setTouchBar(touchBar);
  win.on('close', (e) => {
    // win.webContents.send('before-close');
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

app.on('open-file', (e, filePath) => {
  e.preventDefault();
  // if (win) {
  //   win.send('open-file', filePath);
  // }
});

ipcMain.on('pre-close', async (event, filePath, fileText) => {
  if (!filePath && fileText) {
    const r = await info({
      message: '你要保留此新文件"未命名"吗？',
      detail: '你可以选择保存，或者立即删除此文件。',
      buttons: ['保存', '删除', '取消'],
      cancelId: 2,
      defaultId: 0
    });
    if (r === 0) {
      await saveFile('', fileText);
    } else if (r === 2) {
      return;
    }
  }
  fileOperator.removeFilePath(filePath);
  event.sender.destroy();
})

ipcMain.handle('ondragstart', (event, filePath) => {
  return fileOperator.setFilePath(filePath);
});

ipcMain.handle('save', async (event, filePath, fileText) => {
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
  return r;
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
