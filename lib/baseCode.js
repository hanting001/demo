var BranchLevel = require('../models/base/BranchLevel'),
	BranchType	= require('../models/base/BranchType'),
	BranchTypeLevel = require('../models/base/BranchTypeLevel');

var _branchLevel = [];//定义缓存信息的对象

//通过find获取对应的基表信息
BranchLevel.find().sort('_id').exec(function(err, results) {
	if (!err) {
		_branchLevel = JSON.parse(JSON.stringify(results));
	}
});


var _branchType = [];
BranchType.find().sort('_id').exec(function(err, results){
	if (!err) {
		_branchType = JSON.parse(JSON.stringify(results));
	}
});

var _branchTypeLevel = [];
BranchTypeLevel.find().sort('_id').exec(function(err, results){
	if (!err) {
		_branchTypeLevel = JSON.parse(JSON.stringify(results));
	}
});

var _validBase = [{"key":"1", "value":"有效"}, {"key":"0", "value":"无效"}];

//将获取方法导出
exports.branchLevel = function (key) {
	if (key) {
		var returnValue = '未定义';
		for (var i = 0, l = _branchLevel.length; i < l; i++) {
			var o = _branchLevel[i];
			if (o.key === key) {
				return o.value;
			}
		}
		return returnValue;
	}
	return _branchLevel;
};
exports.branchType = function (key) {
	if (key) {
		var returnValue = '未定义';
		for (var i = 0, l = _branchType.length; i < l; i++) {
			var o = _branchType[i];
			if (o.key === key) {
				return o.value;
			}
		}
		return returnValue;
	}
	return _branchType;
};
exports.branchTypeLevel = function (key) {
	if (key) {
		var returnValue = '未定义';
		for (var i = 0, l = _branchTypeLevel.length; i < l; i++) {
			var o = _branchTypeLevel[i];
			if (o.key === key) {
				return o.value;
			}
		}
		return returnValue;
	}
	return _branchTypeLevel;
};

exports.valid = function (key) {
	if (key) {
		var returnValue = '未定义';
		for (var i = 0, l = _validBase.length; i < l; i++) {
			var o = _validBase[i];
			if (o.key === key) {
				return o.value;
			}
		}
		return returnValue;
	}
	return _validBase;
};
