const mongoose = require('mongoose')

module.exports = async function () {
    mongoose.set('strictQuery', true)
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log('Połączono z bazą danych')
    } catch (err) {
        console.log(err)
    }
}
