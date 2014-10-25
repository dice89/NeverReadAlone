var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');


exports.apiLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
      return res.json({status:0});
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.json({status:0});
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.json({status:1});
    });
  })(req, res, next);
};

exports.apiLogout = function(req, res) {
  req.logout();
  res.json({statusCode:1});
};



exports.getFblink = function(req,res){
   if (!req.user) return res.redirect('/');
   if(req.user.facebook) return res.redirect('/');
   //res.render('facebooklink');
};



/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 * @param provider
 */

exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });

    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */


/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 * @param email
 */