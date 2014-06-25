var BranchLevel = require('../models/base/BranchLevel'),
    BranchType	= require('../models/base/BranchType'),
    BranchTypeLevel = require('../models/base/BranchTypeLevel');

var _branchLevel = [{"key":"0", "value":"总公司"},
    {"key":"1", "value":"分公司"},
    {"key":"2", "value":"支公司"},
    {"key":"3", "value":"营业部"},
    {"key":"4", "value":"营业所"}];;//定义缓存信息的对象

//通过find获取对应的基表信息
//BranchLevel.find().sort('_id').exec(function(err, results) {
//	if (!err) {
//		_branchLevel = JSON.parse(JSON.stringify(results));
//	}
//});


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

var _menuLevelBase = [{"key":"1", "value":"一级菜单"},
    {"key":"2", "value":"二级菜单"},
    {"key":"3", "value":"三级菜单"}];

var _providerTypeBase =[{"key":"1","value":"产险"},
    {"key":"2","value":"寿险"}];

var _channelBase = [{"key":"1","value":"代理人渠道"},
    {"key":"2","value":"电销渠道"},
    {"key":"3","value":"网销渠道"},
    {"key":"4","value":"银行渠道"}];

var _agentStatus = [{"key":"1","value":"待签约"},
    {"key":"2","value":"签约"},
    {"key":"3","value":"离职"}];

var _productStatus = [{"key":"1","value":"待审核"},
    {"key":"2","value":"审核通过"},
    {"key":"3","value":"待发布"},
    {"key":"4","value":"已发布"}];

var _premiumperiod = [{"key":"1","value":"年缴"},
    {"key":"2","value":"半年缴"},
    {"key":"3","value":"月缴"},
    {"key":"4","value":"趸缴"}];

var _chargemode = [{"key":"1","value":"现金"},
    {"key":"2","value":"转账"} ];

var _idtype = [{"key":"1","value":"身份证"},
    {"key":"2","value":"护照"},
    {"key":"3","value":"军人证"},
    {"key":"4","value":"出生证"},
    {"key":"5","value":"港澳证"}
];

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

exports.menuLevel = function (key) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _menuLevelBase.length; i < l; i++) {
            var o = _validBase[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _menuLevelBase;
};

exports.providerType= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _providerTypeBase.length; i < l; i++) {
            var o = _providerTypeBase[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _providerTypeBase;
}

exports.channel= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _channelBase.length; i < l; i++) {
            var o = _channelBase[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _channelBase;
}

exports.agentstatus= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _agentStatus.length; i < l; i++) {
            var o = _agentStatus[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _agentStatus;
}


exports.premiumpreiod= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _premiumperiod.length; i < l; i++) {
            var o = _premiumperiod[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _premiumperiod;
}

exports.chargemode= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _chargemode.length; i < l; i++) {
            var o = _chargemode[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _chargemode;
}

exports.idtype= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _idtype.length; i < l; i++) {
            var o = _idtype[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _idtype;
}