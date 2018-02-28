const Model = require('./main')

class Reply extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        this.content = form.content || ''
        this.ct = Date.now()
        this.ut = this.ct
        this.topic_id = Number(form.topic_id || -1)
    }

    user() {
        const User = require('./user')
        const u = User.get(this.user_id)
        return u
    }
}

module.exports = Reply