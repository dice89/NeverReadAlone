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



exports.getUser = function(req, res){

  User.find({ occupation: /host/ })

};


exports.postUser = function(req,res){

  
};

exports.getOneUser = function(req, res, next){


};


exports.createUser = function(req, res, next) {


  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('name', 'Name needs to be at least 1 character long').len(1);
  req.assert('geo','specify geo loc');


  console.log(JSON.parse(req.body.geo));
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

//'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} },
  var user = new User({
    email: req.body.email,
    password: req.body.password,
    profile:{
      name: req.body.name
    },
    geo: {type:"Point", coordinates:[req.body.geo.lng, req.body.geo.lat]}
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return  next(new Error("Already found a User"));

    }
    user.save(function(err) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
          res.json("User created");
      });
    });
  });
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