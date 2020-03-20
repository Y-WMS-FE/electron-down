const { dialog } = require('electron');

const warning = async (param) => {
  return dialog.showMessageBoxSync({
    type: 'warning', ...param,
  });
};

const info = async (param) => {
  return dialog.showMessageBoxSync({
    type: 'info', ...param,
  });
};

const save = async (param) => {
  return dialog.showSaveDialogSync({
    properties: ['createDirectory'],
    ...param,
  });
};

module.exports = {
  warning,
  info,
  save,
};
