var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	_id		: 	Number,
	value	:	String
},{ collection: 'branchTypeBase' });

module.exports = mongoose.model('BranchType', schema);