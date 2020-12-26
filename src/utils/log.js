const fs = require('fs')
const path = require('path')

// 創建一個 寫日誌 的函數
function writeLog(writeStream, log) {
  writeStream.write(log + '\n')
}

// 創建一個 生成 write stream 對象 的函數
function createWriteStream(filename)  {
  const fullFileName = path.join(__dirname, '../', '../', 'logs', filename)
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a'  // 追加寫入
  })
  return writeStream
}

// 生成 一個 存儲 訪問日誌 的 write stream 對象
const accessWriteStream = createWriteStream('access.log')

// 寫 訪問日誌
function access(log) {
  writeLog(accessWriteStream, log)
}

module.exports = {
  access
}
