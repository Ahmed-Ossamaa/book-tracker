const Message = require('../models/messagesModel')
const asyncHandler = require('express-async-handler')

// create message
const sendMessage = asyncHandler(async (req, res, next) => {

        const { name, email, subject, message } = req.body
        if (!name || !email || !message, !subject) {
                return res.status(400).json({ message: 'All fields are required' })
        }
        const newMessage = await Message.create({ name, email, subject, message })
        res.status(201).json({ data: newMessage })

})

// get all messages (admin)
const getAllMessages = asyncHandler(async (req, res, next) => {
        const messages = await Message.find().sort({ createdAt: -1 })
        res.status(200).json({ data: messages })

})

const deleteMessage = asyncHandler(async (req, res, next) => {
        const { id } = req.params
        const message = await Message.findByIdAndDelete(id)
        res.status(200).json({ data: message, message: 'Message deleted successfully' })
})


const markAsRead = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const message = await Message.findById(id);
        if (!message) throw new NotFoundError("Message not found");

        message.isRead = !message.isRead;
        await message.save();

        res.status(200).json({ success: true, message: `Message marked as ${message.isRead ? 'read' : 'unread'}` });
});
module.exports = { sendMessage, getAllMessages, deleteMessage, markAsRead }
