// 引用 xss 函數
const { xss } = require('xss')

// 引用 統一執行 sql 的函數
const { exec, escape } = require('../db/mysql')

const getList = (author, keyword) => {
  // // 先返回假數據 (格式是正確的)
  // return [
  //   {
  //     id : 1,
  //     title : '標題A',
  //     content : '內容A',
  //     createTime : 1546610491112,
  //     author : 'zhangsan',
  //     state : '1'
  //   },
  //   {
  //     id : 2,
  //     title : '標題B',
  //     content : '內容B',
  //     createTime : 1546710524373,
  //     author : 'lisi',
  //     state : '1'
  //   }
  // ]

  // 定義一個 sql 語句
  let sql = `select * from blogs where 1=1 `  // 好用的技巧(1=1)  // 尾巴有一個空格
  if (author) {
    sql += `and author='${author}' `  // 尾巴有一個空格
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `  // 尾巴有一個空格
  }
  sql += `order by createtime desc;`

  // 返回 promise
  return exec(sql)
}

const getDetail = (id) => {
  // // 先返回假數據 (格式是正確的)
  // return {
  //     id : 1,
  //     title : '標題A',
  //     content : '內容A',
  //     createTime : 1546610491112,
  //     author : 'zhangsan',
  //     state : '1'
  //   }

  // 定義一個 sql 語句
  let sql = `select * from blogs where id='${id}';`

  // 返回 promise
  return exec(sql).then(rows => {
    // 返回 數組裡面的第一個元素, 它是一個 對象
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogData 是一個博客對象，包含 title, content, createTime, author, state 屬性
  // console.log('newBlog blogData : ', blogData)  // ????
  // return {
  //   id: 3  // 表示 新建博客時，插入到數據表 裡面的 id
  // }

  const title = xss(blogData.title)
  console.log('title is ', title)
  const content = xss(blogData.content)
  const createTime = Date.now()
  const author = blogData.author
  const state = blogData.state

  // 定義一個 sql 語句
  let sql = `
    insert into blogs (title, content, createTime, author, state) values ('${title}', '${content}', ${createTime}, '${author}', '${state}');
  `

  // 返回 promise
  return exec(sql).then(insertData => {
    console.log('insertData is ', insertData)
    // 返回 新建博客時，插入到數據表 裡面的 id
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = (id, blogData = {}) => {
  // id 就是 要更新博客的 id
  // blogData 是一個博客對象，包含 title, content, 屬性
  // console.log('update blog : ', id, blogData)  // ????
  // return true

  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const createTime = Date.now()
  const author = blogData.author
  const state = blogData.state

  // 定義一個 sql 語句
  let sql = `
    update blogs set title='${title}', content='${content}' where id=${id} and author='${author}';
  `

  // 返回 promise
  return exec(sql).then(updateData => {
    console.log('updateData is ', updateData)
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const delBlog = (id, author) => {
  // id 就是要 刪除博客的 id
  // console.log('delete blog : ', id)  // ????
  // return true

  // 定義一個 sql 語句
  // let sql = `
  //   update blogs set state=0 where id=${id} and author='${author}';
  // `

  // 定義一個 sql 語句
  let sql = `
    delete from blogs where id=${id} and author='${author}';
  `
  // 返回 promise
  return exec(sql).then(delData => {
    console.log('delData is ', delData)
    if (delData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}
