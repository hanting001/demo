var Menu = require('../models/system/Menu');
var _menuTree = [];
var menuTree = function() {
    if (_menuTree.length > 0) {
        return _menuTree;
    }
    Menu.find({
        levelId: '1'
    }, function(err, menus) {
        menus.forEach(function(menu) {
            var mInfo = {};
            mInfo.subs = [];
            mInfo.menu = menu;
            getMenuInfo(mInfo, function(err, menuInfo){
                if(err) {
                    console.log('err:%s', err);
                }
                _menuTree.push(menuInfo);
            });
        });
    }); 
}
menuTree();
function getMenuInfo(mInfo, cb) {
    mInfo.menu.children(function(err, children) {
        if (err) {
            return cb(err)
        }
        for (var i = 0, l = children.length; i < l; i ++) { 
            var mi = {};
            mi.subs = [];
            mi.menu = children[i];
            getMenuInfo(mi, function(err, m1){
                mInfo.subs.push(m1);
            })
        }
        cb(null, mInfo);
    });
    
}

exports.menuTree = (function() {
    return _menuTree;
})();