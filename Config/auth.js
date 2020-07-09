module.exports = {
    ensureAuthenticated: function( request, response, next ) {
        if (request.isAuthenticated()) {
            return next();
        }

        response.redirect('/users/login');
    }
}