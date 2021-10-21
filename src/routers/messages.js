const express = require('express')
const router = new express.Router();
const Message=require('../models/Message')

// create messages
router.post('/',async(req,res)=>{
    const newMessage= new Message(req.body)
    try{
        const savedMessage=await newMessage.save()
        res.status(200).json(savedMessage)
    }
    catch(err){
        res.status(500).json(err)
    }
})
//set message seen
router.put('/:conversationId',async(req,res)=>{
   
    try{
        const messages=await Message.updateMany({
            $or:[{conversationId:req.params.conversationId,
                status:"not seen"},{conversationId:req.params.conversationId,status:{$exists:false}}]
        },{$set:{status:req.body.status}})

        res.status(200).json(messages)
    }
    catch(err){
        res.status(500).json(err)
    }
})
//get messages
router.get('/:conversationId',async(req,res)=>{
    
    try{
        const messages=await Message.find({
            conversationId:req.params.conversationId
        })
        res.status(200).json(messages)
    }
    catch(err){
        res.status(500).json(err)
    }
    
})

module.exports=router;