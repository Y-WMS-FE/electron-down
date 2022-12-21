const builder = require('electron-builder');
const { Platform } = builder;

builder.build({
  targets: Platform.MAC.createTarget('dmg'),
  config: {
    dmg: {
      title: 'electron-markdown',
      icon: './'
    },
    appId: 'com.young.app',
    files: [
      'assets/*',
      'modules/*',
      'main.js',
    ]
  },
  extendInfo: {}
});
