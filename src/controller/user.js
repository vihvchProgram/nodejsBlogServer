// 引用 xss 函數
const { xss } = require('xss')

// 引用 統一執行 sql 的函數
const { exec, escape } = require('../db/mysql')

// 引用 加密 的函數
const { getPassword } = require('../utils/cryp')

const login = (username, password) => {
  // 生成 加密 密碼
  password = getPassword(password)

  // 預防 sql 注入
  username = escape(escape)
  password = escape(password)

  // // 先使用假數據
  // if (username === 'zhangsan' && password === '123') {
  //   return true
  // }
  // return false

  // 定義一個 sql 語句
  // let sql = `
  //   select username, realname from users where username='${username}' and password='${password}';
  // `

  let sql = `
    select username, realname from users where username=${username} and password=${password};
  `
  console.log('sql is ', sql)

  // 返回 promise
  return exec(sql).then(rows => {
    // 返回 數組裡面的第一個元素, 它是一個 對象
    return rows[0] || {}
  })
}

module.exports = {
  login
}
