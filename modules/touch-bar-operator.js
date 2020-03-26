const { TouchBar } = require('electron');

const { TouchBarLabel, TouchBarButton, TouchBarColorPicker, TouchBarSpacer } = TouchBar;


const fileTitle = new TouchBarLabel();

fileTitle.label = '未命名';

const touchBar = new TouchBar({
  items: [
    new TouchBarSpacer({ size: 'flexible' }),
    fileTitle,
    new TouchBarSpacer({ size: 'flexible' }),
  ]
});

const updateTouchBarLabel = (title) => {
  if (fileTitle.label !== title) {
    fileTitle.label = title;
  }
};

module.exports = {
  touchBar,
  updateTouchBarLabel,
};
