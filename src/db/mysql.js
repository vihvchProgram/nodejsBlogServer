// 引用 mysql 模塊
const mysql = require('mysql')

// 引用 mysql 對象 配置 設定
const { MYSQL_CONF } = require('../conf/db')

// 創建 連接對象
const con = mysql.createConnection(MYSQL_CONF)

// 開始 連接
con.connect()

// 創建 統一執行 sql 的函數
function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
  // 返回 promise
  return promise
}

module.exports = {
  exec,
  escape: mysql.escape
}
