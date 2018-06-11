var // Dependencies
express = require('express'),
passport = require('passport'),
// Models
//Models = require('../models/schemas'),
//User = Models.user,
User = require('../models/userSchema'),
Friend = require('../models/friendSchema'),

router = express.Router();


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


router.get('/', function(req, res) {
    if (req.user == undefined) return res.render("register");
    else res.render('index', {user: req.user, title: "chat"});
});

router.post('/addFriend', function(req, res) {
    console.log(req.body.username);
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) throw err;
        if (user) {
            user.friendRequests.push(req.user.username);
            user.save(function(err) {
                var newFriend = new Friend({
                    username: user.username,
                    status: "Pending"
                });
                req.user.friends.push(newFriend);
                req.user.save(function() {
                    res.end(req.body.username + " was found & added.");
                });
            });
        } else {
            res.end(req.body.username + " was not found.");
        }
    })
});

router.post('/respondRequest', function(req, res) {
    var index = req.user.friendRequests.indexOf(req.body.username);
    if (index > -1) {
        req.user.friendRequests.splice(index, 1);
    }
    if (req.body.accept == "Accept") {
        var newFriend = new Friend({
            username: req.body.username,
            status: "Friend"
        });
        req.user.friends.push(newFriend);

        var update = {
            $set: {
                'friends.$.status': "Friend"
            }
        }

        // Change status from 'Pending' to 'Friend' for the user who sent the request
        User.update({username: req.body.username, "friends.username": req.user.username}, update, function(err) {
            
        });
    }
    req.user.save(function() {
        res.end("Friend Added");
    });
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