const mongoose = require('mongoose')

const Message = mongoose.model('Message',new mongoose.Schema( {
    
        conversationId: {
            type: String,
            required: true,
        },
        sender: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        status:{
            type:String,
            default:"not seen"
        }
},
{
    timestamps:true})
)

module.exports = Message