const express = require('express')
const loadDotEnv = require('./config/loadDotenv')
const connectDatabase = require('./config/connectDatabase')
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const primaryRouter = require('./routes/index')

// ładowanie zminnych środowiskowych i łączenie z bazą danych
loadDotEnv()
connectDatabase()

// port serwera
const PORT = process.env.PORT || 3000

const app = express()

// middlewares
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/api', primaryRouter)

// nasłuchiwanie na porcie
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`)
})
