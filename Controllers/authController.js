const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../Models/User');

const login_page = ( request, response) => {
    response.render('login');
}

const login_handle = ( request, response, next ) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',

    }) ( request, response, next );
}

const register_page = ( request, response ) => {
    response.render('register');
}

const register_handle = ( request, response ) => {
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
}

const logout_handle = ( request, response ) => {
    request.logout();
    response.redirect('/users/login');
}

module.exports = {
    login_page,
    register_page,

    register_handle,
    login_handle,
    logout_handle,
}