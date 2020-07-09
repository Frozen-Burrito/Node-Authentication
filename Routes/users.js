const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../Models/User');

// Login page
router.get('/login', ( request, response ) => {
    response.render('login');
})

// Register page
router.get('/register', ( request, response ) => {
    response.render('register');
})

// Registration
router.post('/register', ( request, response ) => {

    const { name, email, password, password2 } = request.body;
    let formErrors = [];

    if (!name || !email || !password || !password2) {
        formErrors.push({ msg: 'All fields are required' });
    }

    if ( password !== password2 ) {
        formErrors.push({ msg: "Passwords don't match" });
    }

    if ( password.length < 8 ) {
        formErrors.push({ msg: 'Password should be at least 8 characters long' })
    }

    if ( formErrors.length > 0 ) {

        context = {
            formErrors,
            name,
            email,
            password,
            password2
        }

        response.render('register', context);
    } else {
        
        // Check if user exists
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    formErrors.push({ msg: 'Email is already registered' });
                    response.render('register', {
                        formErrors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name, 
                        email,
                        password,
                    });

                    bcrypt.genSalt(10, ( error, salt ) => {
                        bcrypt.hash( newUser.password, salt, ( error, hash ) => {
                            if (error) throw error;

                            newUser.password = hash;
                            newUser.save()
                                .then( createdUser => {
                                    response.redirect('/users/login');
                                })
                                .catch( error => console.log(error));
                        })
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    
})

// Login handle
router.post('/login', ( request, response, next ) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',

    }) ( request, response, next );
})

// Logout
router.get('/logout', ( request, response ) => {
    request.logout();
    response.redirect('/users/login');
})

module.exports = router;