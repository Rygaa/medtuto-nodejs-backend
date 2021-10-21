const mongoose = require('mongoose')

const Conversation = mongoose.model('Conversation',new mongoose.Schema( {
    //Add pubId to Conversation
    pubId: {
        type: String,
        required: true,
    },
    members:{
        type: Array,
        required: true,
    }
        
},
{
    timestamps:true
})
)

module.exports = Conversation