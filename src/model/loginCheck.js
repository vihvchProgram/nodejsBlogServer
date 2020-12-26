// 統一的 登入驗證 函數
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve (
      new ErrorModel('尚未登入')
    )
  }
}

module.exports = {
  loginCheck
}
