var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	username: String,
	code: Number,
	password: String
}),
user = mongoose.model('user', userSchema);

module.exports = user;
