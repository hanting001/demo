'use strict';


var passport = require('passport');
var auth = require('../lib/auth');

module.exports = function (app) {

    app.get('/', auth.isAuthenticated(), function (req, res) {
        res.render('index',{title: '慧宝科技'});
    });
    
	app.get('/login', function(req, res){
		res.render('login', { title: '请登陆',message: req.flash('error') });
	});
	app.post('/login', function (req, res) {
		
		passport.authenticate('local-login',{
			successRedirect: req.session.goingTo || '/',
	        failureRedirect: '/login',
	        failureFlash: true })(req, res);
		
	});
			
	
	app.get('/logout', auth.isAuthenticated(), function(req, res) {
		req.logout();
		res.redirect('/');
	});
};
