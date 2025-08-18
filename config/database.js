const mongoose = require('mongoose')


const connect = async() => {
await mongoose.connect(process.env.DB_CONNECTION_STRING)
}
module.exports = connect
