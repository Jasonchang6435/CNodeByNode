const User = require('../models/user')

const { log } = require('../utils')

const currentUser = (request) => {
    // 通过 session 获取 uid, 如果没有的话就设置成空字符串
    const uid = request.session.uid || ''
    const u = User.findOne('id', uid)
    if (u === null) {
        // 如果当前没有用户登录, 造一个占位的用户
        // 这样我们处理会非常方便,
        // 比如显示用户名就直接用 u.username
        // 而不需要 u !== null && u.username

        // function -> f g h
        const fakeUser = {
            id: -1,
            username: '游客',
            isAdmin: function() {
                return false
            },
            isVip: function() {

            },

        }
        return fakeUser
    } else {
        return u
    }
}

const loginRequired = (request, response, next) => {
    const u = currentUser(request)
    if (u.id === -1) {
        log('登录检测: 没有登录', request.method)
        const baseUrl = '/login'
        // 如果是发送的 GET, 登录完成后就跳转到 next_url
        // 否则直接跳转到登录页面就行
        if (request.method === 'GET') {
            // 应该用一个函数来生成 url, 这里的写法实际上并不好, 因为以后可能还会添加相关的数据
            const nextUrl = baseUrl + '?next_url=' + request.originalUrl
            response.redirect(nextUrl)
        } else {
            response.redirect(baseUrl)
        }
    } else {
        log('如果登录了就什么都不做, 继续下一个请求函数')
        next()
    }
}

const adminRequired = (request, response, next) => {
    const u = currentUser(request)
    if (u.isAdmin()) {
        next()
    } else {
        request.session.flash = {
            message: '管理员才能访问这个页面',
        }
        // response.locals.flash = {
        //     message: '管理员才能访问这个页面',
        // }
        // response.redirect('/login')
        const baseUrl = '/login'
        // 如果是发送的 GET, 登录完成后就跳转到 next_url
        // 否则直接跳转到登录页面就行
        if (request.method === 'GET') {
            // 应该用一个函数来生成 url, 这里的写法实际上并不好, 因为以后可能还会添加相关的数据
            const nextUrl = baseUrl + '?next_url=' + request.originalUrl
            response.redirect(nextUrl)
        } else {
            response.redirect(baseUrl)
        }
    }
}

module.exports = {
    currentUser: currentUser,
    loginRequired: loginRequired,
    adminRequired: adminRequired,
}