var Branch = require('../models/system/Branch');
var _branchTree = [];
var branchTree = function() {
    if (_branchTree.length > 0) {
        return;
    }
    console.log('初始化机构树');
    Branch.find({
        parent: 'top',
        levelId: '0'
    }).
    //sort('sortKey').
    exec(
        function(err, branches) {
            //console.log(11111);
            //console.log(branches);
            branches.forEach(function(branch) {
                var info = {};
                info.code = branch.code;
                info.name = branch.name;
                info.children = []
                getChildren(info, function(err, branch) {
                    if (err) {
                        return console.log('err:%s', err);
                    }
                    _branchTree.push(branch);
                });
            });
            
        });

}
branchTree();

function getChildren(info, cb) {
    Branch.find({
        parent: info.code
    }, function(err, branches) {
        if (err) {
            return cb(err);
        }
        branches.forEach(function(branche) {
            var b = {};
            b.code = branche.code;
            b.name = branche.name;
            b.children = [];
            getChildren(b, function(err, b1) {
                info.children.push(b1);
            });
        });
        cb(null, info);
    })


    // mInfo.menu.children(function(err, children) {
    //     if (err) {
    //         return cb(err)
    //     }
    //     for (var i = 0, l = children.length; i < l; i ++) { 
    //         var mi = {};
    //         mi.subs = [];
    //         mi.menu = children[i];
    //         getMenuInfo(mi, function(err, m1){
    //             mInfo.subs.push(m1);
    //         })
    //     }
    //     cb(null, mInfo);
    // });

}

exports.branchTree = (function() {
    return _branchTree;
})();
exports.refresh = function() {
    _menuTree = [];
    branchTree();
};