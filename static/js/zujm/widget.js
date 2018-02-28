const log = console.log.bind(console)

// 组件类
// js 的 prototype 继承通常来讲是平面的结构
// 我们使用 class 的形式, 构建一棵组件树
// 这样就从扁平化继承变成立体化继承,
// 我们的组件树就会枝繁叶茂

// 我们使用的是自定义事件机制
// 也就是说用 on 监听过后, 使用 fire 可以触发
// 这个其实就是观察者模式
// 也叫做 pub/sub
// 即发布/订阅模型

// document.addEventListener('click', (e) => {
//
// })
//
// 浏览器处理了 fire('click')
class Widget {
    constructor() {
        // 使用 this.handlers 作为一个容器, 存放相应的事件处理函数
        this.handlers = {}
    }

    // on 是绑定事件
    on(type, handler) {
        // off 函数里是将 this.handlers[type] 设置为 null
        // 所以这里需要判断 this.handlers[type] 是 undefined 或者 null 这两种情况
        if (typeof this.handlers[type] === 'undefined' || this.handlers[type] === null) {
            this.handlers[type] = []
        }
        this.handlers[type].push(handler)
        // return this 之后，就可以继续调用类的其他方法，这个就是所谓链式调用法
        // $(element).hide().addClass('foo').siblings().removeClass('foo')
        return this
    }

    // fire 是触发事件
    fire(...args) {
        // 第一个 type 是 event type, 也就是触发的事件类型
        // 剩下的所有参数都放在 rest 中
        const [type, ...rest] = args
        const handlers = this.handlers[type]
        // 如果 handlers 是数组, 就调用
        if (Array.isArray(handlers)) {
            handlers.forEach((k) => {
                var func = k
                func.apply(this, rest)
            })
        }
        return this
    }

    // off 是解绑事件
    off(type) {
        // 如果传入了 type, 就移除 type 对应的 handlers
        // 否则移除所有的 handlers
        if (type !== undefined) {
            this.handlers[type] = null
        } else {
            this.handlers = null
        }
        return this
    }

    // 引入了事件销毁的概念, 也就是说我们的事件是有生命周期的
    destroy() {
        if (Object.keys(this.handlers).length > 0) {
            this.fire('destroyed')
        }
        this.handlers = null
    }

    // single 就是创建一个单例
    static single() {
        const cls = this
        if (cls.instance === undefined) {
            cls.instance = new cls()
        }
        return cls.instance
    }
}

const test = () => {
    const log = console.log.bind(console)
    const w = new Widget()
    const eventType = 'message'

    w.on(eventType, () => {
        log('message event')
    })

    w.on(eventType, () => {
        log('message event 1')
    })

    w.fire(eventType)

    w.off(eventType)

    w.fire(eventType)

    w.on(eventType, () => {
        log('message event 3')
    })

    w.fire(eventType)
}

const main = () => {
    test()
}

main()