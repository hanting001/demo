var Menu = require('../../models/user/Menu');
var baseCode = require('../../lib/baseCode');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var auth = require('../../lib/auth');
module.exports = function(app) {
	app.get('/system/menus', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
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
			res.render('system/menus/index', model);
		}, { sortBy : { sortKey : 1 } });		
	});
	
	app.get('/system/menus/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var model = {};
		model.menu = {levelId : '1'};
		model.parent = {url : '/', fullUrl: '/'};
		res.render('system/menus/add', model);		
	});
	app.post('/system/menus/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var menu = req.body.menu;
		var parent = req.body.parent;
		var menuModel = new Menu(menu);
		menuModel.parent = parent.url;
		menuModel.fullUrl = menuModel.url
		console.log(menuModel);
		menuModel.save(function(err){
			if (err) {
				var model = {
						menu : menu,
						parent : parent
				};
				res.locals.err = err;
				res.locals.view = 'system/menus/add';
				res.locals.model = model;
				return next();			
			}
			req.flash('showMessage', '创建成功');
			res.redirect('/system/menus');
		});
	});
	
	app.get('/system/menus/:parentId/addSub', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var parentId = req.params.parentId;
		Menu.findById(new ObjectId(parentId), 'fullUrl url levelId', function(err, parent){
			if (err) {
				return next(err);
			}
			var model = {
					title : '新增菜单',
					isAdmin : true,
					menu  : {levelId : (new Number(parent.levelId) + 1).toString()},
					parent : parent
				};
			console.log('model:%s', JSON.stringify(model));
			res.render('system/menus/addSub', model);						
		});
	});	
	app.post('/system/menus/:parentId/addSub', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var parentId = req.params.parentId;
		Menu.findById(new Object(parentId), function(err, parent){
			var menuInput = req.body.menu;
			menuInput.parent = parent.fullUrl;
			menuInput.fullUrl = parent.fullUrl + menuInput.url;
			var menuModel = new Menu(menuInput);
			menuModel.save(function(err, menu){
				if(err) {
					var model = {
							menu : menuInput,
							parent : parent
					};
					res.locals.err = err;
					res.locals.view = 'system/menus/addSub';
					res.locals.model = model;
					return next();//调用下一个错误处理middlewear
				} 
				Menu.findByIdAndUpdate(new ObjectId(parentId), {$push:{subs:menu.url}}, function(err){
					if (err){
						//如果此步出错，将已经新增的菜单回滚
						menu.remove(function(err){
							if (err) {
								return next(err);
							}
						});
						return next(err);
					}
					req.flash('showMessage', '创建成功');
					res.redirect('/system/menus/'+parentId +'/down');
				});
			});				
		});			
	});	
	
	
	app.get('/system/menus/:id/edit', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		console.log(id);
		Menu.findById(new ObjectId(id), function(err, menu) {
			if (err) {
				return next(err);
			}
			Menu.findOne({url:menu.parent}, 'fullUrl', function(err, parent){
				if(err) {
					return next(err);
				}
				if (!parent) {
					parent = {url:'/'};
				}
				var model = {
					title : '编辑菜单信息',
					isAdmin : true,
					menu : menu,
					parent : parent,
					showMessage : req.flash('showMessage')
				};			
				res.render('system/menus/edit', model);
			});
		});		
	});
	app.post('/system/menus/:id/edit', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		Menu.findById(new ObjectId(id), function(err, menu){
			if (err) {
				return next(err);
			}
			var newMenu = req.body.menu;
			for (var o in newMenu) {
				menu[o] = newMenu[o];
			}
			menu.save(function(err, menu){
				if(err) {
					newMenu.id = id;
					var model = {
							menu : newMenu,
							parent : req.body.parent
					};
					res.locals.err = err;
					res.locals.view = 'system/menus/edit';
					res.locals.model = model;
					return next();//调用下一个错误处理middlewear
				} 
				req.flash('showMessage', '修改成功');
				res.redirect('/system/menus/' + menu.id + '/edit');
									
			});								
		});		
	});
	
	app.get('/system/menus/:id/down', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Menu.findById(new ObjectId(id), function(err, menu){
			if (err){
				return next(err)
			}
			var condition = {};
			condition.parent = menu.fullUrl;
			condition.levelId = (new Number(menu.levelId) + 1).toString();
			Menu.paginate(condition, page, 10, function(err, pageCount, menus){
				var model = {
						title : '菜单列表',
						isAdmin : true,
						menus : menus,
						page : page,
						pageCount : pageCount,
						showMessage : req.flash('showMessage')
					};			
				res.render('system/menus/index', model);
			}, { sortBy : { sortKey : 1 } });								
		});
	});
	app.get('/system/menus/:id/up', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Menu.findById(new ObjectId(id), function(err, menu){
			if (err){
				return next(err)
			}	
			var condition = {};
			condition.fullUrl = menu.parent;
			Menu.paginate(condition, page, 10, function(err, pageCount, menus){
				var model = {
						title : '菜单列表',
						isAdmin : true,
						menus : menus,
						page : page,
						pageCount : pageCount,
						showMessage : req.flash('showMessage')
					};			
				res.render('system/menus/index', model);
			}, { sortBy : { sortKey : 1 } });								
		});
	});	
	
	app.get('/system/menus/return', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next){
		var id = req.query.id;
		Menu.findById(new ObjectId(id), 'parent', function(err, branch) {
			if (err) {
				return next(err);
			}
			res.redirect('/system/menus?parent=' + branch.parent);
		});
	});
};
