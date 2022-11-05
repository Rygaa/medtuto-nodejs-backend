const express = require('express')
const router = new express.Router();
const Account = require('../models/Account')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const authRoot = require('../middleware/authRoot');


router.post('/login', async (req, res) => {
    try {
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
                picture: account.picture,
                email: account.email,
                isTeacher: account.isTeacher,
                pubId: account.pubId
            })
            return;
        }
    
        res.send({ error: 'Wrong id or password' })
    } catch (error) {
        console.log(error)
    }
   

})


router.get('/profile-picture/:username', async (req, res) => {
    try {
        const arr = req.params.username.split('[');
        const username = arr[0];
        const account = await Account.findOne({ username });
        res.set('Content-Type', 'image/png');
        res.send(account.picture)
    } catch (error) {
        console.log(error)
    }
  
})

router.post('/checkIdToken', auth, async (req, res) => {
    try {
        const account = req.body.account;
        const idToken = req.body.idToken;
        if (account) {
            res.send({
                message: 'Your are login',
                idToken,
                username: account.username,
                picture: account.picture,
                email: account.email,
                isTeacher: account.isTeacher,
                pubId: account.pubId
    
            })
            return;
        }
    } catch (error) {
        console.log(error)
    }
  
})

router.post('/checkIfRoot', authRoot, async (req, res) => {
    try {
        const account = req.body.account;
        const idToken = req.body.idToken;
        if (account) {
            res.send({
                message: 'Your are root',
                idToken,
                username: account.username,
                picture: account.picture,
                pubId: account.pubId
    
    
            })
            return;
        }
    } catch (error) {
        console.log(error)
    }
 
})

router.post('/loginRoot', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password
        const account = await Account.findOne({ username })
    
        if (account === null) {
            res.send({ error: 'Account does not exist' })
            return;
        }
    
        const doesPasswordMatches = (account.password === password)
        if (doesPasswordMatches) {
            if (account.username == 'root') {
                const idToken = jwt.sign({ _id: account._id }, 'Chat-App-shfijksdsdnfuir')
                account.idTokens = account.idTokens.concat(idToken);
                await account.save();
                res.send({
                    message: 'Your are login',
                    username,
                    idToken,
                    picture: account.picture,
                    pubId: account.pubId
    
                })
                return;
            } else {
                res.send({ error: 'Your account does not have access' })
                return;
            }
        
        }
    
        res.send({ error: 'Wrong id or password' })
    
    } catch (error) {
        console.log(error)
    }
   
})


module.exports = router