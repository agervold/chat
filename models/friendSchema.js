var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Friend = new Schema({
    username: String,
    status: String
    //conversations: { type: Array, default: [] }
});

module.exports = mongoose.model('Friend', Friend);