const dotenv = require('dotenv')
const path = require('path')
const __server_dirname = require('./__server_dirname')

module.exports = function () {
    const envPath = path.join(__server_dirname, '.env')
    dotenv.config({ path: envPath })
}
