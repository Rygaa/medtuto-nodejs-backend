const express = require('express')
const router = new express.Router();
const Account = require('../models/Account')

router.get('/',async(req,res)=>{
    const pubId=req.query.userId;
    const username=req.query.username;
    console.log(pubId)
    console.log(username)
    try{
        const user=pubId ? await Account.findOne({pubId})
                         :  await Account.findOne({username})
        const {email,password,tutorat,_id,idTokens,...otherFields}=user._doc
        res.status(200).json(otherFields)
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports=router