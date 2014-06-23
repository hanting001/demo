var Menu = require('../../models/user/Menu');
var baseCode = require('../../lib/baseCode');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {
	app.get('/menus', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var parent = '/';
		if (req.query.parent) {
			parent = req.query.parent;
		}
		Menu.paginate({parent:parent}, page, 10, function(err, pageCount, menus) {
			if (err) {
				return next(err);
			}
			var model = {
					title : '菜单列表',
					isAdmin : true,
					menus : menus,
					page : page,
					pageCount : pageCount,
					showMessage : req.flash('showMessage')
				};
			res.render('user/menus/index', model);
		}, { sortBy : { sortKey : 1 } });		
	});
};
