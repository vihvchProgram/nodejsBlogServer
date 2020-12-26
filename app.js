const querystring = require('querystring')

const { SSL_OP_ALL } = require('constants')

const { handleBlogRouter } = require('./src/router/blog')
const { handleUserRouter } = require('./src/router/user')

const { getPostData } = require('./src/model/getPostdata')
const { getCookieExpires } = require('./src/model/getCookie')

const { get, set } = require('./src/db/redis')

const { access } = require('./src/utils/log')

// 設定 sever服務內容 相關
const serverHandle = (req, res) => {
  // 紀錄 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  // 設置返回格式為 JSON
  res.setHeader('content-type', 'application/json')

  // 獲取 path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析 query
  req.query = querystring.parse(url.split('?')[1])

  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''  // k1=v1;k2=v2;k3=v3
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    console.log(key, val)
    req.cookie[key] = val
  })
  console.log('req.cookie is ', req.cookie)

  // // session 數據
  // const SESSION_DATA = {}
  // // 解析 session
  // let needSetCookie = false
  // let userId = req.cookie.userid
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   userId = '${Date.now()}_${Math.random()}'
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]

  // 解析 session  (使用 redis)
  let needSetCookie = false
  let userId = req.cookie.userid
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化 redis 中的 session 值
    set(userId, {})
  }
  // 獲取 session
  req.sessionId = userId
  get(req.sessionId).then(sessionData => {
    if (sessionData == null) {
      // 初始化 redis 中的 session 值
      set(req.sessionId, {})
      // 設置 session
      req.session = {}
    } else {
      // 設置 session
      req.session = sessionData
    }
    console.log('req.session : ', req.session)

    // 處理 post data
    return getPostData(req)
  })
  .then(postData => {
    req.body = postData

    // // 處理 post data
    // getPostData(req).then(postData => {
    //   req.body = postData

    // // 處理 blog 路由
    // const blogData = handleBlogRouter(req, res)
    // if (blogData) {
    //   res.end(
    //     JSON.stringify(blogData)
    //   )
    //   return
    // }

    // 接收 promise 對象
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', 'userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()};')
        }
        res.end(
          JSON.stringify(blogData)
        )
      })
      return
    }

    // // 處理 user 路由
    // const userData = handleUserRouter(req, res)
    // if (userData) {
    //   res.end(
    //     JSON.stringify(userData)
    //   )
    //   return
    // }

    // 接收 promise 對象
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', 'userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()};')
        }
        res.end(
          JSON.stringify(userData)
        )
      })
      return
    }

    // 未命中路由，返回 404
    res.writeHead(404, {'content-type' : 'text/plain'})
    res.write('404 Not Found !!\n')
    res.end()
  })
}

module.exports = serverHandle
