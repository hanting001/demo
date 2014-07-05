var auth = require('../../lib/auth');
var menuHelper = require('../../lib/menuHelper');
var Role = require('../../models/system/Role');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var auth = require('../../lib/auth');
module.exports = function(app) {
	app.get('/system/roles', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		Role.paginate({}, page, 10, function(err, pageCount, roles) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '角色列表',
				roles: roles,
				page: page,
				pageCount: pageCount,
				showMessage: req.flash('showMessage')
			};
			res.render('system/roles/index', model);
		}, {
			sortBy: {
				createdAt: -1
			}
		});
	});

	app.post('/system/roles/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var role = req.body.role;
		console.log(role);
		var roleModel = new Role(role);
		roleModel.save(function(err) {
			if (err) {
				var model = {
					role: role
				};
				res.locals.err = err;
				res.locals.view = 'system/roles/index';
				res.locals.model = model;
				return next();
			}
			req.flash('showMessage', '创建成功');
			res.redirect('/system/auth/roles');
		});
	});

	app.get('/system/roles/:id/load', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		console.log(id);
		Role.findById(new ObjectId(id), function(err, role) {
			if (err) {
				return next(err);
			}
			res.json(role);
		});
	});
	app.post('/system/roles/:id/save', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		var roleInput = req.body.role;
		console.log(roleInput);
		Role.findById(new ObjectId(id), function(err, role) {
			if (err) {
				return next(err);
			}
			for (var o in roleInput) {
				role[o] = roleInput[o];
			}
			role.save(function(err, role) {
				if (err) {
					var model = {
						role: roleInput
					};
					res.locals.err = err;
					res.locals.view = 'system/roles';
					res.locals.model = model;
					return next(); //调用下一个错误处理middlewear
				}
				req.flash('showMessage', '修改成功');
				res.redirect('/system/auth/roles');
			});
		});
	});
	app.get('/system/roles/:id/delete', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		Role.findByIdAndRemove(new ObjectId(id), function(err, role) {
			if (err) {
				return next(err);
			}
			res.json({
				message: 'OK'
			});
		});
	});
	app.get('/system/roles/:id/addMenus', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var model = {};
		var menuTree = menuHelper.menuTree;
		// for (var i = 0, l = menuTree.length; i < l; i ++) {
		// 	var menuInfo = menuTree[i];
		// 	console.log('一级：%s', menuInfo.menu.name);
		// 	for (var i1 = 0, l1 = menuInfo.subs.length; i1 < l1; i1 ++) {
		// 		var mi = menuInfo.subs[i1];
		// 		console.log('二级：%s', mi.menu.name);
		// 		for (var i2 = 0, l2 = mi.subs.length; i2 < l2; i2 ++) {
		// 			var mi1 = mi.subs[i2];
		// 			console.log('三级：%s', mi1.menu.name);
		// 		}
		// 	}
		// }
		console.log(menuTree);
		model.title = '分配用户菜单';
		model.menuTree = menuTree;
		res.render('system/roles/addMenus', model);
	});
};