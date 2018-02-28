const express = require('express')

const Topic = require('../models/topic')
const Board = require('../models/board')
const Model = Topic
const { log } = require('../utils')
const { currentUser, loginRequired } = require('./main')

// 使用 express.Router 可以创建模块化的路由
// 类似我们以前实现的形式
const topic = express.Router()

topic.get('/', (request, response) => {
    const board_id = Number(request.query.board_id || -1)
    let ms = Topic.allList(board_id)
    // if (board_id === -1) {
    //     ms = Topic.all()
    // } else {
    //     ms = Topic.find('board_id', board_id)
    // }
    // const ms = Model.all(board_id)
    const boards = Board.all()
    const args = {
        topics: ms,
        boards: boards,
        board_id: board_id,
    }
    // log('debug args', args)
    response.render('topic/index.html', args)
})

topic.get('/detail/:id', (request, response) => {
    const id = Number(request.params.id)
    // const t = Topic.findOne('id', id)
    // t.views += 1
    // t.save()
    // const args = {
    //     topic: t,
    // }
    const m = Topic.get(id)
    const args = {
        topic: m,
    }
    response.render('topic/detail.html', args)
})

topic.get('/new', (request, response) => {
    const boards = Board.all()
    const args = {
        boards: boards,
    }
    response.render('topic/new.html', args)
})

topic.post('/add', (request, response) => {
    // 获取添加 topic 的表单内容
    const form = request.body
    // 调用 create 方法保存 topic
    const u = currentUser(request)
    form.user_id = u.id
    const m = Model.create(form)
    // 重定向到 topic 首页
    response.redirect('/topic')
})

topic.get('/delete/:id', loginRequired, (request, response) => {
    // :id 这个方式是动态路由, 意思是这个路由可以匹配一系列不同的路由
    // 动态路由是现在流行的路由设计方案
    // 动态路由的参数通过 request.params 获取
    // Model.remove 的参数是一个数字, 所以这里需要转一下
    // 注意, 这里很容易出现的 bug 是传一个字符串 '1', 结果取出来的是 null
    // 这种类型的问题, 由调用方自己保证
    const id = Number(request.params.id)
    // 根据 id 删除 topic, remove 方法顺便返回了 topic 这个 model,
    // 有些场景下是需要使用的
    const t = Model.remove(id)
    response.redirect('/todo')
})

topic.get('/edit/:id', (request, response) => {
    const id = Number(request.params.id)
    const m = Model.get(id)
    const args = {
        topic: m,
    }
    response.render('todo/edit.html', args)
})

topic.post('/update', (request, response) => {
    const form = request.body
    const m = Model.update(form)
    response.redirect('/todo')
})

module.exports = topic

