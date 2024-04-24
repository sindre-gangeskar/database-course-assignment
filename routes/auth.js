const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');

const db = require('../models');
const UserService = require('../services/UserService');
const userService = new UserService(db);

passport.use(new LocalStrategy(function verify(username, password, cb) {
    userService.getOneByName(username).then(data => {
        if (data.Username !== username || data.Password !== password) {
            return cb(null, false, { message: 'Incorrect username or password' });
        }
        else {
            return cb(null, data);
        }
    })
}))

passport.serializeUser(function (user, cb) {
    process.nextTick(async function () {
        if (!user) {
            user = await userService.getOneByName(user.Username);
        }
        const role = user.Role ? user.Role.Type : null;
        const serializedUser = {
            id: user.id,
            Username: user.Username,
            RoleId: user.RoleId,
            Role: role
        };
        return cb(null, serializedUser);
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    })
})

router.get('/login', function (req, res, next) {
    res.render('login', { user: req?.user })
})

router.get('/signup', function (req, res, next) {
    res.render('signup', { user: req?.user });
})

router.post('/signup', async function (req, res, next) {
    var obj = {
        Username: req.body.Username,
        Password: req.body.Password,
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
    }
    const { Username, Password, Firstname, Lastname } = obj;
    await userService.create(Username, Password, Firstname, Lastname);
    res.redirect('/login');
})

router.post('/login/password', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
}));

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) return next(err);
        res.redirect('/');
    })
})

module.exports = router;