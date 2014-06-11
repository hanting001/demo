
var mongodb = require('mongodb');

exports.up = function(db, next){
	var brancheLevel = mongodb.Collection(db, 'branchLevelBase');
	brancheLevel.insert({
		_id	: 1,
		value	:	'总公司'
	}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("create sucess");
		}
	});
	brancheLevel.insert({
		_id	: 2,
		value	:	'分公司'
	}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("create sucess");
		}
	});
	brancheLevel.insert({
		_id	: 3,
		value	:	'营业部'
	}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("create sucess");
		}
	});
	brancheLevel.insert({
		_id	: 4,
		value	:	'营业区'
	}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("create sucess");
		}
	});
	
	var branchTypeLevel = mongodb.Collection(db, 'branchTypeLevelBase');
	branchTypeLevel.insert({
		_id	: 1,
		value	:	'A类机构'
	}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("create sucess");
		}
	});	
	branchTypeLevel.insert({
		_id	: 2,
		value	:	'B类机构'
	}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("create sucess");
		}
	});
	branchTypeLevel.insert({
		_id	: 3,
		value	:	'C类机构'
	}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("create sucess");
		}
	});
	
	var branchType = mongodb.Collection(db, 'branchTypeBase');
	branchType.insert({
		_id	: 1,
		value	:	'直营'
	}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("create sucess");
		}
	});	
	branchType.insert({
		_id	: 2,
		value	:	'其它'
	}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("create sucess");
		}
	});
    next();
};

exports.down = function(db, next){
    next();
};
