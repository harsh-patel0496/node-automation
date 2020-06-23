const mongoose = require('mongoose')
//const validator = require('validator')
const url = 'mongodb://127.0.0.1:27017'

mongoose.connect(`${url}/react_node`,{
    useNewUrlParser: true,
    useCreateIndex: true
})