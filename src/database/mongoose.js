const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/medicaltutoring', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
})





