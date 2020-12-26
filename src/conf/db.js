// 獲取 環境參數 (定義在 package.json)
const env = process.env.NODE_ENV

// mysql 對象 配置
let MYSQL_CONF = {}

// redis 對象 配置
let REDIS_CONF = {}

// 開發環境
if (env === 'dev') {
  // mysql
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    port: '3000',
    database: 'myblog'
  }
  // redis
  REDIS_CONF = {
    port: '3001',
    host: '127.0.0.1'
  }
}

// 線上環境
if (env === 'production') {
  // mysql
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    port: '3000',
    database: 'myblog'
  }
  // redis
  REDIS_CONF = {
    port: '3001',
    host: '127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}
