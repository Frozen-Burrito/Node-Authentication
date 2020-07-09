const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');

const router = require('./Routes/index');
const userRouter = require('./Routes/users');

const passport = require('passport');
const session = require('express-session');

const app = express();

require('./Config/passport')(passport);

// Database config
const dbKey = require('./Config/keys').MongoURI;

mongoose.connect(dbKey, { useNewUrlParser: true })
    .then(() => console.log('DB connected'))
    .catch( error  => console.log(error));

// Templates
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'A secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// App Routes
app.use('/', router);
app.use('/users', userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server on port ${PORT}`));

