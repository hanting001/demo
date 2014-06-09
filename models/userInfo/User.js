var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name : {
		type : String,
		unique : true
	},
	password : String,
	role : String
});




module.exports = mongoose.model('User', userSchema);
