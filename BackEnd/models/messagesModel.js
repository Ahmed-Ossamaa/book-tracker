const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required' ],
        trim: true
    },
    email: {
        type: String,
        required: [ true, 'Email is required' ],
        trim: true
    },
    subject: {
        type: String,
        required: [ true, 'Subject is required' ],
        maxLength:[ 50, 'Subject must not exceed 50 characters' ],
        trim: true
    },
    message: {
        type: String,
        required: [ true, 'Message is required' ],
        maxLength:[ 500, 'Message must not exceed 500 characters' ],
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Message', messageSchema)
