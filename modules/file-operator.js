const fs = require('mz/fs');
const path = require('path');
const { fileOperateType } = require('./enums.js');

let filePath = '';

const formatFileRes = () => {
  return {

  }
};

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

const createFile = async (filePath, fileText) => {
  if (!fs.exists(filePath)) {
    return await writeFile(filePath, fileText);
  } else {
    return {
      fileName: path.basename(filePath),
      filePath: filePath,
      status: fileOperateType.EXISTS,
    };
  }
};

const cleanCache = () => {
  setFilePath('');
  return true;
};




module.exports = {
  setFilePath,
  getFilePath,
  readFile,
  writeFile,
  cleanCache,
  createFile,
};

