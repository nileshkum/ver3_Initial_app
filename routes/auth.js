const express = require('express');

const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const User = require('../Model/user');


const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', [
    check('email').isEmail().withMessage('Please enter valid value')
        .custom((value, { req }) => {
            // for value check same as below
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email exists already!');
                        // req.flash('error', 'Email exists already!');
                        // return res.redirect('/signup');
                    }
                });
        }),

    body('passowrd',
        'Please enter a password with min 5 characters')
        .isLength({ min: 5 })
        .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password have to match!');
        }
        return true;
    })],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;