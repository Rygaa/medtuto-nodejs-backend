require('./src/database/mongoose');
const signUp = require('./src/routers/sign-up')
const login = require('./src/routers/login')
const faculty = require('./src/routers/Joho/faculty')
const year = require('./src/routers/Joho/year')
const model = require('./src/routers/Joho/model')
const course = require('./src/routers/Joho/course')
const member = require('./src/routers/member')
const create = require('./src/routers/trash/create')
const test = require('./src/routers/trash/test')
const myAccount = require('./src/routers/my-account')

const express = require('express')
const cors = require('cors');
const { urlencoded } = require('express');
const app = express()
const router = new express.Router();

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(2000)
app.use(cors());
app.use(express.json())
app.use(router)
app.use(signUp)
app.use(login)
app.use(faculty)
app.use(year)
app.use(model)
app.use(course)
app.use(member)
app.use(create)
app.use(test)
app.use(myAccount)
app.use(require("./src/routers/root/course__"))
app.use(require("./src/routers/root/faculty__"))
app.use(require("./src/routers/root/year__"))
app.use(require("./src/routers/root/model__"))
app.use(express.static('public'));
app.use('/images', express.static('images'));
// app.use(express.urlencoded({extended: true}))