const express = require('express');
const router = express.Router();
const userService = require('./user.service');

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function registerUser(req, res, next) {
    userService.createUser(req.body)
        .then(res.status(200).json({ message: 'User registered successfully' }))
        .catch(err => next(err));
}

// Users routes
router.post('/authenticate', authenticate);
router.post('/register', registerUser);

module.exports = router;
