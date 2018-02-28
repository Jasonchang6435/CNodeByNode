const express = require('express')

const router = express.Router()

router.get('/all', (request, response) => {
    const movies = require('./data')
    const r = {
        success: true,
        data: movies,
        message: ''
    }
    response.json(r)
})

module.exports = router