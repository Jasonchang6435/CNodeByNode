const ajax = function(url, method, form, success, error) {
    var p = new Promise((resolve, reject) => {
        const request = {
            url: url,
            method: method,
            contentType: 'application/json',
            success: function(r) {
                if (success) {
                    success(r)
                }
                resolve(r)
            },
            error: function(e) {
                const r = {
                    success: false,
                    message: '网络错误, 请重新尝试',
                }
                reject(r)
            },
        }
        if (method === 'post') {
            const data = JSON.stringify(form)
            request.data = data
        }
        $.ajax(request)
    })
    return p
}

class Api {
    get(path, response) {
        const url = path
        const method = 'get'
        const form = {}
        return ajax(url, method, form, response, response)
    }

    post(path, form, response) {
        const url = path
        console.log('debug this.baseUrl', path, this)
        const method = 'post'
        return ajax(url, method, form, response, response)
    }

    static stringify(query) {
        const s = Object.keys(query).map((k) => {
            const v = query[k]
            return `${k}=${v}`
        }).join('&')
        return s
    }

    // ES6 里的单例模式
    static single() {
        const cls = this
        if (cls.instance === undefined) {
            cls.instance = new cls()
        }
        return cls.instance
    }
}

class MovieApi extends Api {
    constructor() {
        super()
        this.path = '/api/movie'
    }

    fetchMovies() {
        var path = this.path + '/all'
        return this.get(path)
    }

    static fetchMovie(id) {
        var path = this.path + `/${id}`
        return this.get(path)
    }
}