const express = require('express')
const router = new express.Router();
const Conversation=require('../models/Conversation')
const { nanoid } = require('nanoid');

//new conversation
router.post('/',async(req,res)=>{
    const newConversation= new Conversation({
        pubId:nanoid(),
        members:[req.body.senderId,req.body.receiverId]
    })
    try{
        const savedConversation=await newConversation.save()
        res.status(200).json(savedConversation)
    }
    catch(err){
        res.status(500).json(err)
    }
})
//get conversations
router.get('/:userId',async(req,res)=>{
    
    try{
        const conversation=await Conversation.find({
            members:{$in:[req.params.userId]}
        })
        res.status(200).json(conversation)
    }
    catch(err){
        res.status(500).json(err)
    }
    
})



module.exports=router