const express = require('express')
const { sendMessage, getAllMessages,deleteMessage, markAsRead } = require("../controllers/messagesController")
const{messageSchema} = require("../validation/messageValidator")
const { validate } = require("../middleware/validate")
const { isAdmin } = require('../middleware/adminMiddleware')
const {protect} = require("../middleware/authMiddleware")
const router = express.Router()



router.post("/message",validate(messageSchema),sendMessage)
router.get("/messages",protect,isAdmin,getAllMessages)
router.delete("/message/:id",protect,isAdmin,deleteMessage)
router.patch("/message/:id", protect,isAdmin, markAsRead);


module.exports = router