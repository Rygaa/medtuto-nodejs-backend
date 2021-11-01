const jwt = require('jsonwebtoken')
const Account = require('../models/Account');

const auth = async (req, res, next) => {
    console.log(req.body);

    const idToken = req.body.idToken;
    if (!idToken) {
        res.send({
            error: 'Please log in'
        })
        return

    }
    const _id = jwt.verify(idToken, 'Chat-App-shfijksdsdnfuir')
    const account = await Account.findById(_id);
    if (!account) {
        res.send({
            error: 'Please log in'
        })
        return

    }

    req.body.account = account;
    next();

}

module.exports = auth;