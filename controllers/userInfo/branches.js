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
		
		Branch.paginate({}, page, 10, function(err, pageCount, branches) {
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
		var branch = req.body.branch;
		branch.parent = new ObjectId(id);
		branch.status = '1';
		//添加其它信息省略
		//...
		console.log(22222);
		var branchModel = new Branch(branch);
		branchModel.save(function(err){
			if(err) {
				var model = {
						branch : branch,
						parent : {id : id, abbrName : req.body.parentAbbr}
				};
				res.locals.err = err;
				res.locals.view = 'userInfo/branches/addSub';
				res.locals.model = model;
				next();//调用下一个错误处理middlewear
			} else {
				req.flash('showMessage', '创建成功');
				res.redirect('/branches');
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
};
