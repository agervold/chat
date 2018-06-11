 /*
TODO:
 */

var // Dependencies
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
express = require('express'),
mongoose = require('mongoose'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
User = require('./models/userSchema');
//User = require('./models/schemas').user;

mongoose.connect('mongodb://localhost/chat');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.use('/', require('./routes/index'));


// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8888);

exports.app = app;