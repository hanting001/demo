'use strict';
module.exports = function () {
    return function (req, res, next) {
        res.locals.theme = req.session.theme;
        next();
    };
};