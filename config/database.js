const { default: mongoose } = require("mongoose")
require("dotenv").config()
const uri = process.env.MONGO_URI;
//console.log(`uri:`,uri)

const DbConnection = async() => {
    try {
        await mongoose.connect(uri)
        console.log(`DB Connected Successfully.`)
    } catch (error) {
        console.log(`Db Error at:${error.message}`)
    }
}

module.exports = DbConnection;