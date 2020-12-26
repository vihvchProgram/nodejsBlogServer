const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')

const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel')

const { loginCheck } = require('../model/loginCheck')

const handleBlogRouter = (req, res) => {
  const method = req.method  // GET or POST
  const id = req.query.id

  // 獲取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    // return {
    //   msg : '這是獲取博客列表的接口'
    // }

    let author = req.query.author || ''
    const keyword = req.query.keyword || ''

    // 權限控制
    if (req.query.isadmin) {
      // 管理員頁面
      const loginCheckResult = loginCheck(req)
      if (loginCheckResult) {
        // 未登入
        return loginCheckResult
      }
      // 強制 查詢自己的博客
      author = req.session.username
    }

    // const listData = getList(author, keyword)
    // return new SuccessModel(listData)

    // 返回 (接收到的 promise 對象)
    const result = getList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }

  // 獲取博客詳情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    // return {
    //   msg : '這是獲取博客詳情的接口'
    // }

    // const data = getDetail(id)
    // return new SuccessModel(data)

    // 返回 (接收到的 promise 對象)
    const result = getDetail(id)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 新建一篇博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    // return {
    //   msg : '這是新建一篇博客的接口'
    // }

    // 登入驗證
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登入
      return loginCheckResult
    }

    // // 先使用假數據
    // req.body.author = 'zhangsan'  // 待開發 登入功能時，再改成 真實數據
    // req.body.state = '1'  // 有效

    req.body.author = req.session.username
    req.body.state = '1'  // 有效

    // const data = newBlog(req.body)
    // return new SuccessModel(data)

    // 返回 (接收到的 promise 對象)
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 更新一篇博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    // return {
    //   msg : '這是更新一篇博客的接口'
    // }

    // 登入驗證
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登入
      return loginCheckResult
    }

    // // 先使用假數據
    // req.body.author = 'zhangsan'  // 待開發 登入功能時，再改成 真實數據

    req.body.author = req.session.username

    // const result = updateBlog(id, req.body)
    // if (result) {
    //   return new SuccessModel()
    // } else {
    //   return new ErrorModel('更新 博客失敗')
    // }

    // 返回 (接收到的 promise 對象)
    const result = updateBlog(id, req.body)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('更新 博客失敗')
      }
    })
  }

  // 刪除一篇博客
  if (method === 'POST' && req.path === '/api/blog/del') {
    // return {
    //   msg : '這是刪除一篇博客的接口'
    // }

    // 登入驗證
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登入
      return loginCheckResult
    }

    // // 先使用假數據
    // const author = 'zhangsan'  // 待開發 登入功能時，再改成 真實數據

    req.body.author = req.session.username

    // const result = delBlog(id, author)
    // if (result) {
    //   return new SuccessModel()
    // } else {
    //   return new ErrorModel('刪除 博客失敗')
    // }

    // 返回 (接收到的 promise 對象)
    const result = delBlog(id, author)
    return result.then(val => {
      if (val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('刪除 博客失敗')
      }
    })
  }
}

module.exports = handleBlogRouter
