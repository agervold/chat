var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    //email: String,
    friendRequests: { type: Array, default: [] },
    friends: { type: Array, default: [] },
    conversations: { type: Array, default: [] }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);