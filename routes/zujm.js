const express = require('express')

const { log } = require('../utils')

// 使用 express.Router 可以创建模块化的路由
// 类似我们以前实现的形式
const main = express.Router()

main.get('/', (request, response) => {
    response.render('zujm/index.html')
})

module.exports = {
    zujm: main
}

