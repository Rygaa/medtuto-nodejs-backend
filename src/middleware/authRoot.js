const jwt = require('jsonwebtoken')
const Account = require('../models/Account');

const authRoot = async (req, res, next) => {
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
    if (account.username !== "root") {
        res.send({
            error: 'You do not have access to this page'
        })
        return
    }

    req.body.account = account;
    next();

}

module.exports = authRoot;