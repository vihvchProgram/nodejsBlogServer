// 啟動 sever服務 相關
const http = require('http')

const PORT = 1000
const serverHandle = require('../app')

const server = http.createServer(serverHandle)
server.listen(PORT, () => {
  console.log('listening on 1000 port')
})
