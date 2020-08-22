const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const passport = require('passport');
const session = require('express-session');

const router = require('./Routes/index');
const userRouter = require('./Routes/users');

const connectMongoDB = require('./Config/connectMongoDB');
const passportStrategy = require('./Config/passport');

const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env'})
}

// View Engine
app.set('view engine', 'ejs');  
app.use(expressLayouts);

// Database config
connectMongoDB(process.env.MONGODB_URL);

// Static Files
app.use(express.static('Public'));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Auth
passportStrategy(passport);

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server on port ${PORT}`));

