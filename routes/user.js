const express = require('express')
// multer 是用来处理上传文件的模块
const multer = require('multer')
// 文件上传之后保存的路径, 这个路径希望做成可以配置的, 所以就写入到 config 中
const { uploadPath } = require('../config')

// 配置 multer 模块
// dest 表示文件上传之后保存的路径
const upload = multer({
    dest: uploadPath,
})

const User = require('../models/user')
const { log } = require('../utils')
const { currentUser, loginRequired, } = require('./main')

const main = express.Router()

// 用户的个人资料页面的路由
main.get('/profile/:id', loginRequired, (request, response) => {
    const id = Number(request.params.id)
    const m = User.get(id)
    const args = {
        user: m,
    }
    response.render('user/profile.html', args)
})

// 用户上传头像的路由, 这里会依次调用三个处理函数
main.post('/upload/avatar', loginRequired, upload.single('avatar'), (request, response) => {
    // upload.single 获取上传的单个文件并且处理
    // request.file 是处理之后的信息
    log('debug request file', request.file)
    const u = currentUser(request)
    const avatar = request.file
    // filename 是保存在 dest 中的文件名,
    // 这里我们不使用用户上传的文件名, 直接用 multer 处理之后的名字
    // 因为用户上传的文件名从安全角度来看是有风险的
    // >> bash_profile
    u.avatar = avatar.filename
    u.save()
    log('debug u', u)
    response.redirect(`/user/profile/${u.id}`)
})

// 获取头像的路由
main.get('/avatar/:filename', (request, response) => {
    const path = require('path')
    // 头像所在的路径, 我们配置的时候使用的是相对路径
    const filename = request.params.filename
    const p = uploadPath + filename
    // response.sendFile 的参数是一个绝对路径
    // 使用 path.resolve 把头像的路径转换成绝对路径
    const absolutePath = path.resolve(p)
    // 实际上图片也是发一个请求, 我们最初的课程是按照 /static?file 的形式来处理的
    // 常见的验证码是一张图片, 处理方式也是这种
    // /captcha?random=45678
    // 点击图片的时候会换一张验证码, 实际上就是拿到前端传过来的随机数,
    // 然后生成一个新的随机数, 最后写入到图片中
    response.sendFile(absolutePath)
})

module.exports = {
    user: main,
}