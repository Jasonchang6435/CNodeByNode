const fs = require('fs')

//
const formattedTime = () => {
    const d = new Date()
    // js 中 month 是从 0 开始计算
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()
    const t = `${hours}:${minutes}:${seconds}`
    return t
}

// logs
const log = (...args) => {
    const t = formattedTime()
    const arg = [t].concat(args)
    console.log.apply(console, arg)
    const content = t + ' ' + args + '\n'
    fs.writeFileSync('log.txt', content, {
        flag: 'a',
    })
}

module.exports = {
    log: log,
}