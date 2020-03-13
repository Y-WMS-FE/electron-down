const fs = require('mz/fs');
const path = require('path');
const { fileOperateType } = require('./enums.js');

let filePath = '';

const setFilePath = (fp = '') => {
  filePath = fp;
  return true;
};

const getFilePath = () => {
  return filePath;
};

const readFile = async () => {
  return await fs.readFile(filePath, 'utf-8');
};

const writeFile = async (filePath = '', fileText) => {
  const result = {
    fileName: path.basename(filePath),
    filePath: filePath,
  };
  if (!filePath) {
    result.status = fileOperateType.NULL;
    return result;
  }
  try {
    await fs.writeFile(filePath, fileText);
    result.status = fileOperateType.SUCCESS;
    return result;
  } catch (e) {
    result.status = fileOperateType.ERROR;
    return result;
  }
};

const cleanCache = () => {
  setFilePath('');
  console.log('clean cache success!');
  return true;
};


module.exports = {
  setFilePath,
  getFilePath,
  readFile,
  writeFile,
  cleanCache,
};

