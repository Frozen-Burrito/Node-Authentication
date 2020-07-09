const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../Config/auth');

router.get('/', ( request, response ) => {
    response.render('landing');
})

router.get('/dashboard', ensureAuthenticated, ( request, response ) => {
    response.render('dashboard', { name: request.user.name })
})

module.exports = router;