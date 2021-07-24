const db = require('./db.js');
const config = require('../config');
const fs = require('fs');
const bcryptjs = require('bcryptjs');

class User {

    static async init() {
        db.users = [];

        if (config.db.loadMockupData) {
            const mockups = JSON.parse(fs.readFileSync('./models/mockups/users.json', 'utf8'));
            mockups.forEach(async (mockup) => {
                await User.createUser(mockup);
            })
        }

        console.log('Users table initialised');
    }

    static async createUser(user) {
        db.users.push({...user});
        return db.users[db.users.length-1];
    }

    static async findUserByName(name) {
        return db.users.find(user => user.name === name);
    }

    static checkPassword(user, password) {
        return password === user.password;
   }
}

module.exports = User;