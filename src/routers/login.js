const express = require('express')
const router = new express.Router();
const Account = require('../models/Account')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password
    const account = await Account.findOne({ username })

    if (account === null) {
        res.send({ error: 'Account does not exist' })
        return;
    }

    const doesPasswordMatches = (account.password === password)
    if (doesPasswordMatches) {
        const idToken = jwt.sign({ _id: account._id }, 'Chat-App-shfijksdsdnfuir')
        account.idTokens = account.idTokens.concat(idToken);
        await account.save();
        res.send({
            message: 'Your are login',
            username,
            idToken,
            picture: account.picture
        })
        return;
    }

    res.send({ error: 'Wrong id or password' })

})


router.get('/profile-picture/:username', async (req, res) => {
    const arr = req.params.username.split('[');
    const username = arr[0];
    const account = await Account.findOne({ username });
    res.set('Content-Type', 'image/png');
    res.send(account.picture)
})

router.post('/checkIdToken', auth, async (req, res) => {
    const account = req.body.account;
    const idToken = req.body.idToken;
    if (account) {
        res.send({
            message: 'Your are login',
            idToken,
            username: account.username,
            picture: account.picture
        })
        return;
    }
    res.send({
        error: 'Wrong id or password'

    })


})

module.exports = router