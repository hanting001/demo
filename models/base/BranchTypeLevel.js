var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	_id		: 	Number,
	value	:	String
},{ collection: 'branchTypeLevelBase' });

module.exports = mongoose.model('BranchTypeLevel', schema);