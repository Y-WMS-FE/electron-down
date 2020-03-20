const deffer = require('./deffer');

// 将xx.on('ww', fn)的操作转换成promise
exports.transform2Promise = (fn, listener, handler) => {
  const p = deffer();
  fn(listener, (...arg) => {
    handler(...arg);
    p.resolve();
  });
  return p.promise;
};
