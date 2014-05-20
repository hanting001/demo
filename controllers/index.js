'use strict';


var passport = require('passport');


module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index',{
			title: '天安开发'});
    });
    
	app.get('/login', function(req, res){
		res.render('login', { title: '登陆',message: req.flash('error') });
	});
	app.post('/login', function (req, res) {
		
		passport.authenticate('local-login',{
			successRedirect: req.session.goingTo || '/',
	        failureRedirect: '/login',
	        failureFlash: true })(req, res);
		
	});
			
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};
