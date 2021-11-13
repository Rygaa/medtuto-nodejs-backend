require('./src/database/mongoose');
const signUp = require('./src/routers/sign-up')
const login = require('./src/routers/login')
const faculty = require('./src/routers/faculty')
const year = require('./src/routers/year')
const model = require('./src/routers/model')
const course = require('./src/routers/course')

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
app.use(signUp)
app.use(login)
app.use(faculty)
app.use(year)
app.use(model)
app.use(course)
app.use(express.static('public'));
app.use('/images', express.static('images'));