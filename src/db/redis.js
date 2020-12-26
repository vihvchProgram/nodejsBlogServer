// 引用 redis 模塊
const redis = require('redis')

// 引用 redis 對象 配置 設定
const { REDIS_CONF } = require('../conf/db')

// 創建 客戶端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
  console.error(err)
})

// 創建 set 方法 的函數
function set(key, val) {
  if(typeof val ==='object') {
    // 若為 對象 格式，就先轉換為 字串 格式
    val = JSON.stringify(val)
  }
  redisClient.set(key. val, redis.print)
}

// 創建 get 方法 的函數
function get(key) {
  const promise =new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      // 異常處理
      if(err) {
        reject(err)
        return
      }

      // 數值為空
      if (val == null) {
        resolve(null)
        return
      }

      // 嘗試 轉換為 JSON 對象 格式
      try {
        resolve(
          JSON.parse(val)
        )
      } catch (ex) {
        resolve(val)
      }
    })
  })
  return promise;
}

module.exports = {
  set,
  get
}
