module.exports = function() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            var roleMenuTree = req.session.roleMenuTree;
            var url = req.originalUrl;
            if (url.indexOf('/user/base') >= 0) {
                res.locals.subIndex = -1;
                next();
            }
            for (var i = 0, l = roleMenuTree.length; i < l; i++) {
                if (url.indexOf(roleMenuTree[i].menu.fullUrl) >= 0) {
                    res.locals.subIndex = i;
                    break;
                }
            }
        }
        next();
    };
};