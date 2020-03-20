const { screen } = require('electron');

let winMap = new Map();

const addWin = (win, position) => {
  winMap.set(win, position);
};

const removeWin = (win) => {
  if (win) {
    winMap.delete(win);
  } else {
    winMap.clear();
  }
};

// 获取win
const getWinPosition = () => {
  const { size: { width, height } } = screen.getPrimaryDisplay();
  const i = winMap.size;
  const x = ((width / 2) - 275) + (i * 20);
  const y = ((height / 2) - 350) + (i * 20);
  return { x, y };
};

const getWinNum = () => {
  return winMap.size;
};

module.exports = {
  addWin,
  removeWin,
  getWinPosition,
  getWinNum,
};
