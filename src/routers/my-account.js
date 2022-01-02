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
        res.send({
            message: `${username} is now a teacher`,
        })
    } catch (error) {
        res.send({
            error: "error during update-teacher-status"
        })
    }
})
const path = require("path");

router.get('/account/:pubId', async (req, res) => {
    const pubId = req.params.pubId.split('[')[0];
    res.set('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, `../../src/images/accounts/${pubId}.png`))
})

var multer = require('multer');
const auth = require('../middleware/auth');
const upload = multer({ dest: 'images', storage: multer.memoryStorage() });
router.post('/update-my-account-picture', upload.array("files", 5), auth, async (req, res) => {
    const picture = new Buffer(req.files[0].buffer, 'base64');
    const account = req.body.account;
    fs.writeFile(`./src/images/accounts/${account.pubId}.png`, picture, function (err) {
    });

    res.send({
        status: "Success"
    })
})


router.post('/update-my-account', upload.array("files", 5), auth, async (req, res) => {
    const picture = req.body.files == 'null' ? null : new Buffer(req.files[0].buffer, 'base64');
    const account = req.body.account;
    const passwordsMatch = req.body.currentPassword == account.password ? true : false;
    if (passwordsMatch) {
        console.log('right password');
    } else {
        console.log('wrong password');
    }

    if (picture) {
        fs.writeFile(`./src/images/accounts/${account.pubId}.png`, picture, function (err) { });
    }
    account.email = req.body.newEmail;
    account.username = req.body.newUsername;
    await account.save()

    res.send({
        status: "Success"
    })
    console.log(req.body);
})




module.exports = router
