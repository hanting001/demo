var auth = require('../../lib/auth');
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
			res.redirect('/system/roles');
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
				res.redirect('/system/roles');
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
	app.get('/system/rolses/:id/addMenus', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		res.render('system/menus/menuTree');
	});
};