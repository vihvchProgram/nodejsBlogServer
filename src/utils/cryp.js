// 引入 加密的 庫
const crypto = require('crypto')

// 密匙
const SECRET_KEY = 'ABCD'

// md5 加密
function md5(content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}

// 加密函數
function getPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`
  return md5(str)
}

// 測試
// const result = getPassword('123')
// console.log(result)

module.exports = {
  getPassword
}
