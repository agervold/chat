var // Dependencies
express = require('express'),
passport = require('passport'),
// Models
//Models = require('../models/schemas'),
//User = Models.user,
User = require('../models/userSchema'),

router = express.Router();


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


router.get('/', function(req, res) {
    if (req.user == undefined) return res.render("register");
    else res.render('index', {user: req.user, title: "chat"});
});

router.post('/m', function(req, res) {
    console.log(req.body.message);
    res.end(req.body.message);
});


router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        } else if (!user) { // If the user doesn't exist, try to create it
            var user = new User({ 
                username: req.body.username
            });
            User.register(user, req.body.password, function(err, User) {
                if (err) {
                    return res.render('register', { status_message : 'A user with the given email is already registered' });
                }
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/');          
                });
            });
        } else {
            req.login(user, function(err) {
                if(err){
                    return next(err);
                }
                return res.redirect('/');
            });    
        }
    })(req, res, next);
});

module.exports = router;