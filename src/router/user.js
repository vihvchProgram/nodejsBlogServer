const { login } = require('../controller/user')

const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel')

const { loginCheck } = require('../model/loginCheck')

const { getCookieExpires } = require('../model/getCookie')

const handleUserRouter = (req, res) => {
  const method = req.method  // GET or POST
  const id = req.query.id

  // 登入
  if (method === 'POST' && req.path === '/api/user/login') {
    // return {
    //   msg : '這是登入的接口'
    // }

    // const { username, password } = req.body
    // const result = login(username, password)
    // if (result) {
    //   return new SuccessModel()
    // }
    // return new ErrorModel('登入 失敗')

    // const { username, password } = req.body
    // // 返回 (接收到的 promise 對象)
    // const result = login(username, password)
    // return result.then(data => {
    //   if (data.username) {
    //     return new SuccessModel()
    //   }
    //   return new ErrorModel('登入 失敗')
    // })

    // const { username, password } = req.query  // GET 方式  驗證使用
    const { username, password } = req.body
    // 返回 (接收到的 promise 對象)
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        // // 操作 cookie
        // res.setHeader('Set-Cookie', 'username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()};')

        // 設置 session
        req.session.username = data.username
        req.session.realname = data.realname

        console.log('req.session is ', req.session)

        // 同步到 redis
        setImmediate(req.sessionId, req.session)

        return new SuccessModel()
      }
      return new ErrorModel('登入 失敗')
    })
  }

  // 登入驗證 的測試
  if (method === 'GET' && req.path === '/api/user/login-test') {
    // // 返回 promise 對象
    // if (req.cookie.username) {
    //   return Promise.resolve (
    //     new SuccessModel({
    //       username: req.cookie.username
    //     })
    //   )
    // }

    // 返回 promise 對象
    if (req.session.username) {
      return Promise.resolve (
        new SuccessModel({
          session: req.session
        })
      )
    }
    return Promise.resolve (
      new ErrorModel('尚未登入')
    )
  }
}

module.exports = handleUserRouter
