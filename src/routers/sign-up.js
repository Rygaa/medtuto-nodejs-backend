const express = require('express')
const router = new express.Router();
const Account = require('../models/Account')
var fs = require('fs');
const { nanoid } = require('nanoid');
const fsPromises = fs.promises;
const validator = require('validator');
router.post('/signUp', async (req, res) => {
    try {
        const pubId = nanoid();
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        if (!validator.isEmail(email)) {
            res.send({ error: 'Provide a correct email' })
            return;
        }
        const isUsernameUsed = await Account.findOne({ username })
        if (isUsernameUsed) {
            res.send({ error: 'Username already used' })
            return;
        }
        const isEmailUsed = await Account.findOne({ email })
        if (isEmailUsed) {
            if (isUsernameUsed) {
                res.send({ error: 'account already exist' })
            } else {
                res.send({ error: 'Username already used' })
            }
            return;
        }
        const newAccount = new Account({ pubId, username, password, email, isTeacher: false })
        const picture = await fsPromises.readFile(`${__dirname}/../images/base/profile-picture.png`);
        const savePicture = await fsPromises.writeFile(`./src/images/accounts/${pubId}.png`, picture);
        await newAccount.save();
        res.send({ message: 'Account created' })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router