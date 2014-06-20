var Branch = require('../../models/userInfo/Branch');
var baseCode = require('../../lib/baseCode');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
module.exports = function(app) {
	app.get('/branches', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		console.log(111111111111);
		//查询1级机构列表
		Branch.paginate({levelId:'1'}, page, 10, function(err, pageCount, branches) {
			if (err) {
				return next(err);
			}
			var model = {
					title : '机构列表',
					isAdmin : true,
					branches : branches,
					page : page,
					pageCount : pageCount,
					showMessage : req.flash('showMessage')
				};			
			res.render('userInfo/branches/index', model);
		}, { sortBy : { code : 1 } });
	});

	app.get('/branches/:id/addSub', function(req, res, next) {
		var id = req.params.id;
		Branch.findById(new ObjectId(id), 'abbrName', function(err, branch){
			if (err) {
				return next(err);
			}
			var model = {
					title : '新增机构',
					isAdmin : true,
					parent : {abbrName:branch.abbrName, id:id}
				};
			res.render('userInfo/branches/addSub', model);	
			
		});
	});
	
	app.post('/branches/:id/addSub', function(req, res, next) {
		var id = req.params.id;
		var branchInput = req.body.branch;
		branchInput.parent = new ObjectId(id);
		branchInput.status = '1';
		//添加其它信息省略
		//...
		var branchModel = new Branch(branchInput);
		branchModel.save(function(err, branch){
			if(err) {
				var model = {
						branch : branchInput,
						parent : {id : id, abbrName : req.body.parentAbbr}
				};
				res.locals.err = err;
				res.locals.view = 'userInfo/branches/addSub';
				res.locals.model = model;
				next();//调用下一个错误处理middlewear
			} else {
				Branch.findByIdAndUpdate(branch.parent, {$push:{subs:branch.id}}, function(err){
					if (err){
						next(err);
					} else {
						req.flash('showMessage', '创建成功');
						res.redirect('/branches');
					}
				});
			}
		});
	});
	
	app.get('/branches/:id/edit', function(req, res, next) {
		var id = req.params.id;
		Branch.findById(new ObjectId(id), function(err, branch) {
			if (err) {
				return next(err);
			}
			Branch.findById(branch.parent, 'abbrName', function(err, parent){
				console.log(parent);
				var model = {
					title : '编辑机构信息',
					isAdmin : true,
					branch : branch,
					parent : parent,
					showMessage : req.flash('showMessage')
				};			
				res.render('userInfo/branches/edit', model);
			});
		});
	});
	app.post('/branches/:id/edit', function(req, res, next) {
		var id = req.params.id;
		//var branchNew = req.body.branch;
		//console.log(branch);
		Branch.findOne({_id : new ObjectId(id)}, function(err, branch){
			if (!err) {
				var newBranch = req.body.branch;
				for (var o in newBranch) {
						branch[o] = newBranch[o];
				}
				branch.save(function(err, branch){
					if(err) {
						newBranch.id = id;
						var model = {
								branch : newBranch,
								parent : {id : req.body.parentId, abbrName : req.body.parentAbbr}
						};
						res.locals.err = err;
						res.locals.view = 'userInfo/branches/edit';
						res.locals.model = model;
						next();//调用下一个错误处理middlewear
					} else {
						req.flash('showMessage', '修改成功');
						res.redirect('/branches/' + branch.id + '/edit');
					}					
				});					
			}			
		});
	});
	app.get('/branches/:id/down', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Branch.findOne({_id : new ObjectId(id)}, function(err, branch){
			if (err){
				next(err)
			} else {
				var condition = {};
				condition.parent = branch.id;
				condition.levelId = (new Number(branch.levelId) + 1).toString();
				Branch.paginate(condition, page, 10, function(err, pageCount, branches){
					var model = {
							title : '机构列表',
							isAdmin : true,
							branches : branches,
							page : page,
							pageCount : pageCount,
							showMessage : req.flash('showMessage')
						};			
					res.render('userInfo/branches/index', model);
				}, { sortBy : { code : 1 } });					
			}			
		});
	});
	app.get('/branches/:id/up', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Branch.findOne({_id : new ObjectId(id)}, function(err, branch){
			if (err){
				next(err)
			} else {
				var condition = {};
				condition._id = branch.parent;
				console.log(condition._id);
				var upLevel = new Number(branch.levelId) - 1;
				if (upLevel > 0) {
					condition.levelId = upLevel.toString();
				}
				Branch.paginate(condition, page, 10, function(err, pageCount, branches){
					var model = {
							title : '机构列表',
							isAdmin : true,
							branches : branches,
							page : page,
							pageCount : pageCount,
							showMessage : req.flash('showMessage')
						};			
					res.render('userInfo/branches/index', model);
				}, { sortBy : { code : 1 } });					
			}			
		});
	});
};
