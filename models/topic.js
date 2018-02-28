const Model = require('./main')

class Topic extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        // views 是这个 topic 的浏览数目
        this.views = 0
        this.title = form.title || ''
        this.content = form.content || ''
        this.ct = Date.now()
        this.ut = this.ct
        this.user_id = form.user_id || ''
        this.board_id = Number(form.board_id || -1)
    }

    static get(id) {
        const m = super.get(id)
        m.views += 1
        m.save()
        return m
    }

    static fakeCreate(form) {
        const m = super.create(form)
        if (m === null) {
            const obj = {
                success: false,
                data: null,
                message: '用户名已经使用',
            }
            return obj
        } else {
            const obj = {
                success: true,
                data: m,
                message: '',
            }
            return obj
        }
    }

    static allList(board_id) {
        let ms = []
        if (board_id === -1) {
            // 相当于 Model.all()
            ms = super.all()
        } else {
            ms = super.find('board_id', board_id)
        }
        return ms
    }

    user() {
        const User = require('./user')
        const u = User.findOne('id', this.user_id)
        return u
    }

    replies() {
        const Reply = require('./reply')
        const ms = Reply.find('topic_id', this.id)
        return ms
    }

    board() {
        const Board = require('./board')
        const b = Board.findOne('id', this.board_id)
        return b
    }
}

module.exports = Topic