class Movie extends Widget {
    constructor(options) {
        super()
        this._options = options
        this.body = this._options.wrapper
        this._components = {}
        // 组件的生命周期
        this.renderHtml()
        this.bindEvents()
    }

    bindEvents() {
        this.body.on('click', 'a', (e) => {
            e.preventDefault()
            var self = e.target
            var value = $(self).closest('a').find('span').text()
            var singleStore = this._options.store.single()
            // 把数据添加到 store 中, 方便其他地方使用
            singleStore.add('item', value)
            // 触发 item 事件
            this._components['item'].fire('item')
        })
    }

    renderHtml() {
        this.renderItems()
    }

    renderItems() {
        var movies = this._options.data
        var ms = movies.map((m) => {
            var cover = m.cover
            var title = m.title
            var score = m.rate
            var s = (`
                <li>
                    <a href="">
                        <div>
                            <img src="${cover}" alt="${title}">
                        </div>
                        <p>
                            <span>${title}</span>
                            <strong>${score}</strong>
                        </p>
                    </a>
                </li>
            `)
            return s
        }).join('')
        var t = (`
            <ul class="movie-list">
                ${ms}
            </ul>
        `)
        var container = this._options.wrapper
        container.append(t)
        // 顺便在这里初始化了 Tooltip 的实例
        // 我们没有使用 webpack, 这里只是为了演示原理, 所以直接这么写
        this._components['item'] = new Tooltip(this._options)
    }
}