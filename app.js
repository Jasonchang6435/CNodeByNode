const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const cors = require('cors')
const { log } = require('./utils')
const { secretKey } = require('./config')
const app = express()
//
app.use(cors())
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false,
}))
// application/json
app.use(bodyParser.json())
// 设置 session from config.js
app.use(session({
    secret: secretKey,
}))
// config nunjucks
const env = nunjucks.configure('templates', {
    autoescape: true,
    express: app,
    noCache: true,
})
// nunjucks filter
env.addFilter('formattedTime', (ts) => {
    const formattedTime = require('./filter/formattedTime')
    const s = formattedTime(ts)
    return s
})

//
const asset = __dirname + '/static'
app.use('/static', express.static(asset))
app.use((request, response, next) => {
    response.locals.flash = request.session.flash
    delete request.session.flash
    next()
})

// 引入路由文件
const index = require('./routes/index')
const topic = require('./routes/topic')
const reply = require('./routes/reply')
//
const { board } = require('./routes/board')
const { user } = require('./routes/user')
const { zujm } = require('./routes/zujm')
//
app.use('/', index)
app.use('/topic', topic)
app.use('/reply', reply)
app.use('/board', board)
app.use('/user', user)
app.use('/zujm', zujm)
//
const apiTopic = require('./api/topic')
app.use('/api/topic', apiTopic)
//
const apiMovie = require('./api/movie')
app.use('/api/movie', apiMovie)
// 404
app.use((request, response) => {
    response.status(404)
    response.render('404.html')
})
// 500 error
app.use((error, request, response, next) => {
    console.error(error.stack)
    response.status(500)
    response.send('定制的 500 错误')
})

const run = (port=3000, host='') => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        host = address.address
        port = address.port
        log(`listening server at http://${host}:${port}`)
    })
}

if (require.main === module) {
    const port = 3000
    const host = 'localhost'
    run(port, host)
}

/*
TODO
* new user profile need upload headimg
* navibar need to jump user profile
*
* nunjucks template
*
* sudo lsof -i:3000
* sudo kill -9 980
*/
