const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Tutorat', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
})
