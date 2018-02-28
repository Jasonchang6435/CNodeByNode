const express = require('express')

const Reply = require('../models/reply')
const Model = Reply
const { log } = require('../utils')
const { currentUser, loginRequired, } = require('./main')

// 使用 express.Router 可以创建模块化的路由
// 类似我们以前实现的形式
const reply = express.Router()

reply.post('/add', loginRequired, (request, response) => {
    const form = request.body
    const u = currentUser(request)
    console.log('DEBUG', form)
    const kwargs = {
        user_id: u.id
    }
    const m = Reply.create(form, kwargs)
    response.redirect(`/topic/detail/${m.topic_id}`)
})

module.exports = reply