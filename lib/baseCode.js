var BranchLevel = require('../models/base/BranchLevel'),
	BranchType	= require('../models/base/BranchType'),
	BranchTypeLevel = require('../models/base/BranchTypeLevel');

var _branchLevel = {};
BranchLevel.find({}, function(err, results) {
	if (!err) {
		_branchLevel = results;
	}
});

var _branchType = {};
BranchType.find({}, function(err, results){
	if (!err) {
		_branchType = results;
	}
});

var _branchTypeLevel = {};
BranchTypeLevel.find({}, function(err, results){
	if (!err) {
		_branchTypeLevel = results;
	}
});


exports.branchLevel = function () {
	return _branchLevel;
};
exports.branchType = function () {
	return _branchType;
};
exports.branchTypeLevel = function (key) {
	return _branchTypeLevel;
};