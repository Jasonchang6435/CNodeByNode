// import Store from './store'
// import Tooltip from './tooltip'
// import Movie from './movie'

var initMovie = (data) => {
    var options = {
        wrapper: $('.wrapper'),
        data: data,
        store: Store,
        components: Tooltip,
    }
    new Movie(options)
    // new Movie(options)

    // new Movie({
    //     wrapper: $('.wrapper'),
    //     data: data,
    //     store: Store,
    //     components: Tooltip,
    // })
}

var __main = () => {
    var m = MovieApi.single()
    // 链式调用
    // 回调处理方案
    m.fetchMovies().then((r) => {
        initMovie(r.data)
    })
}

$(document).ready(() => {
    __main()
})