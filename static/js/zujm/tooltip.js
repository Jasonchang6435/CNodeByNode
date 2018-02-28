class Tooltip extends Widget {
    constructor() {
        super()
        this.wrapper = $('.tooltip-wrapper')
        this.bindEvents()
        this.renderHtml()
    }

    bindEvents() {
        var key = 'item'
        var event = eventMapper[key]
        var singleStore = Store.single()
        singleStore.on(event, () => {
            var m = singleStore.find(key)
            this.renderTooltip(m)
        })
    }

    renderTooltip(data) {
        var s = JSON.stringify(data)
        this.wrapper.html(s)
    }

    renderHtml() {

    }
}

// dsl

// movieList: [
//     movieItem
//         img
//         title
//     movieItem
//         img
//         title
//     movieItem
//         img
//         title
// ]