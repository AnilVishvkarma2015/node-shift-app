const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const log = require('log4js').getLogger('application');
const db = require('../shared/dataSource');
const User = db.User;

async function authenticate({ email, password }) {
    const user = await User.findOne({ email });

    const secret = config.get('authenticationSecret');
    const tokenTimeout = config.get('tokenExpireInTime');
    if (user && bcrypt.compareSync(password, user.password)) {
        const { password, ...userWithoutPassword } = user.toObject();
        const token = jwt.sign({ sub: user.id }, secret, { expiresIn: tokenTimeout });
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function createUser(userParams) {
    if (await User.findOne({ email: userParams.email })) {
        throw 'Email "' + userParams.email + '" is already taken';
    }

    const user = new User(userParams);

    // hash password
    if (userParams.password) {
        user.password = bcrypt.hashSync(userParams.password, 10);
    }

    // save user
    await user.save();
}


module.exports = {
    authenticate,
    createUser
};
