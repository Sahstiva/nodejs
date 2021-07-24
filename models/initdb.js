const config = require('../config');
const db = require('./db.js');

const User = require('./user.js');

module.exports = async function initDB() {
    await User.init();

    console.log('Database initialised');    
}
