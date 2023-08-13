const express = require('express')
const router = new express.Router();
const Account = require('../models/Account')

router.get('/',async(req,res)=>{
    const pubId=req.query.userId;
    const username=req.query.username;
    console.log(pubId)
    console.log(username)
    try{
        const result=pubId ? await Account.findOne({pubId})
                         :  await Account.find({username:{$regex:new RegExp(username)}})
        if(pubId){
            const {email,password,tutorat,_id,idTokens,...otherFields}=user._doc
        res.status(200).json(otherFields)
        }
        const users=result.map(user=>{
            const {email,password,tutorat,_id,idTokens,...otherFields}=user._doc
            return otherFields
        })
        
       res.json(users)
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports=router