var BranchLevel = require('../models/base/BranchLevel'),
	BranchType	= require('../models/base/BranchType'),
	BranchTypeLevel = require('../models/base/BranchTypeLevel');

var _branchLevel = {};
BranchLevel.find().sort('_id').exec(function(err, results) {
	if (!err) {
		_branchLevel = JSON.parse(JSON.stringify(results));
	}
});


var _branchType = {};
BranchType.find().sort('_id').exec(function(err, results){
	if (!err) {
		_branchType = JSON.parse(JSON.stringify(results));
	}
});

var _branchTypeLevel = {};
BranchTypeLevel.find().sort('_id').exec(function(err, results){
	if (!err) {
		_branchTypeLevel = JSON.parse(JSON.stringify(results));
	}
});



exports.branchLevel = function () {
	return _branchLevel;
};
exports.branchType = function () {
	return _branchType;
};
exports.branchTypeLevel = function () {
	return _branchTypeLevel;
};