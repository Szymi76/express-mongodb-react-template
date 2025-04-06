const { Router } = require('express')
const verifyToken = require('../middlewares/verifyToken')

const register = require('../controllers/auth/register')
const login = require('../controllers/auth/login')
const getUserById = require('../controllers/auth/getUserById')
const refresh = require('../controllers/auth/refresh')

const router = Router()

// @GET
router.get('/user/:userId', verifyToken, getUserById)

// @POST
router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)

module.exports = router
