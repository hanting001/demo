/**
 * Module that will handle our authentication tasks
 */
'use strict';

var User = require('../models/user/User'),
    LocalStrategy = require('passport-local').Strategy;

exports.config = function (settings) {

};

/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localStrategy = function () {

    return new LocalStrategy(function (username, password, done) {

        //Retrieve the user from the database by login
        User.findOne({'name': username}, function (err, user) {

            //If something weird happens, abort.
            if (err) {
                return done(err);
            }

            //If we couldn't find a matching user, flash a message explaining what happened
            if (!user) {
                return done(null, false, { message: '用户不存在' });
            }

            //Make sure that the provided password matches what's in the DB.
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Oops! 错误的密码' });
            }

            //If everything passes, return the retrieved user object.
            done(null, user);

        });
    });
};

/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localSignup = function() {
	return new LocalStrategy(function (username, password, done) {
		User.findOne({
			'name' : username
		}, function(err, user) {
			// if there are any errors, return the error
			if (err){
				return done(err);
			}
			// check to see if theres already a user with that email
			if (user) {
				return done(null, false, { message: '该用户名已经被注册了' });
			} else {

				// if there is no user with that email
				// create the user
				var newUser = new User();
				// set the user's local credentials
				newUser.name = username;
				newUser.password = password;
				newUser.role = 'user';
				// save the user
				newUser.save(function(err) {
					if (err) {
						throw err;
					}
					return done(null, newUser);
				});
			}
		});
	});
	
};

/**
 * A helper method to determine if a user has been authenticated, and if they have the right role.
 * If the user is not known, redirect to the login page. If the role doesn't match, show a 403 page.
 * @param role The role that a user should have to pass authentication.
 */
exports.isAuthenticated = function (role) {

    return function (req, res, next) {

        if (!req.isAuthenticated()) {

            //If the user is not authorized, save the location that was being accessed so we can redirect afterwards.
            req.session.goingTo = req.url;
            res.redirect('/login');
            return;
        }

        //If a role was specified, make sure that the user has it.
        if (role && req.user.roles.indexOf(role) < 0) {
            res.status(401);
            res.render('errors/401');
            return;
        }

        next();
    };
};

/**
 * A helper method to add the user to the response context so we don't have to manually do it.
 * @param req
 * @param res
 * @param next
 */
exports.injectUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
};