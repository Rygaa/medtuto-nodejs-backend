require('./src/database/mongoose');
const add = require('./src/routers/add')
const create = require('./src/routers/create')
const signUp = require('./src/routers/sign-up')
const login = require('./src/routers/login')
const testt = require('./src/routers/test')

const express = require('express')
const cors = require('cors');
const app = express()
const router = new express.Router();

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(3005)
app.use(cors());
app.use(express.json())
app.use(router)
app.use(add)
app.use(create)
app.use(signUp)
app.use(login)
app.use(testt)
