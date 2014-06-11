var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	_id		: 	Number,
	value	:	String
},{ collection: 'branchLevelBase' });

module.exports = mongoose.model('BranchLevel', schema);