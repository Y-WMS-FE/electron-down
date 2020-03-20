const S = require('./symbol-generater');

// filePath的枚举状态 0: 不存在, 1: 成功 2: 失败
const fileOperateType = {
  NULL: S('NULL'),
  SUCCESS: S('SUCCESS'),
  ERROR: S('ERROR'),
  EXISTS: S('EXISTS'),
};

module.exports = {
  fileOperateType,
};


