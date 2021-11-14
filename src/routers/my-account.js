const express = require('express')
const router = new express.Router();
const Faculty = require('../models/Faculty')
const Model = require('../models/Model')
const { nanoid } = require('nanoid');
const fs = require('fs');
const Year = require('../models/Year');
const Course = require('../models/Course');
const authRoot = require('../middleware/authRoot');
const Account = require('../models/Account');


router.post('/my-account', authRoot, async (req, res) => {
    try {
        const accountsRaw = await Account.find({})
        const accounts = []
        for (let i = 0; i < accountsRaw.length; i++) {
            accounts.push({
                username: accountsRaw[i].username,
                isTeacher: accountsRaw[i].isTeacher,
            })
        }
        res.send({
            message: "Teachers received",
            accounts
        })
    } catch (error) {
        res.send({
            error: "error during Teachers received"
        })
    }
})


router.post('/update-teacher-status', authRoot, async (req, res) => {
    try {
        const username = req.body.memberUsername;
        const account = await Account.findOne({ username });

        const newStatus = req.body.newStatus;
        account.isTeacher = newStatus;
        await account.save();
        console.log(account.isTeacher);
        res.send({
            message: `${username} is now a teacher`,
        })
    } catch (error) {
        res.send({
            error: "error during update-teacher-status"
        })
    }
})






module.exports = router
