const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 文件名
const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log')

// 創建一個 read stream 對象
const readStream = fs.createReadStream(fileName)

// 創建一個 readline 對象
const rl = readline.createInterface({
  input: readStream
})

// 統計 範例
let chromeNum = 0
let sum = 0

// 逐行讀取
rl.on('line', (lineData) => {
  // 異常 排除， 當lineData什麼都沒有的話
  if (!lineData) {
    return
  }

  // 紀錄 總行數
  sum++

  // 透過 邏輯計算 特徵，分析日誌  (可依據自己 業務的需求 修改 內容)
  const arr = lineData.split(' -- ')
  if (arr[2] && arr[2].indexOf('Chrome') > 0) {
    // 累加 chrome 的數量
    chromeNum++
  }
})

// 監聽 讀取完成
rl.on('close', () => {
  console.log('chrome 占比: ' + chromeNum / sum)
})
