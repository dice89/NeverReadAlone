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
        return res.json({
            status: 0
        });
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.json({
                status: 0
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.json({
                status: 1
            });
        });
    })(req, res, next);
};

exports.apiLogout = function(req, res) {
    req.logout();
    res.json({
        statusCode: 1
    });
};



exports.getFblink = function(req, res) {
    if (!req.user) return res.redirect('/');
    if (req.user.facebook) return res.redirect('/');
    //res.render('facebooklink');
};



exports.getUser = function(req, res, next) {

    var lat = parseFloat(req.param('lat'));
    var lng = parseFloat(req.param('lng'));

    var radius = parseFloat(req.param('radius'));

    console.log(lat);
    console.log(lng);
    console.log(radius);
    var query = User.find({}).where('geo').near({
        center: {
            coordinates: [lng, lat],
            type: 'Point'
        },
        maxDistance: radius
    });

    //try with promises
    query.exec()
        .then(function(data) {
            res.json(data);
        }, function(err) {
            return nrext(err);
        });

};

<<<<<<< HEAD

exports.postUser = function(req, res) {
    var update_user = req.body.user;
=======
exports.getOneUser = function(req, res, next){
	console.log("Fetch a user");
>>>>>>> fae142cf3c1e0c349714098cde0e45e60b251fba

    

};

exports.getOneUser = function(req, res, next) {


};


exports.createUser = function(req, res, next) {


    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('name', 'Name needs to be at least 1 character long').len(1);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
    }

    //'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} },
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        profile: {
            name: req.body.name
        },
        geo: {
            type: "Point",
            coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
        }
    });

    User.findOne({
        email: req.body.email
    }, function(err, existingUser) {
        if (existingUser) {
            return next(new Error("Already found a User"));

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
        user.tokens = _.reject(user.tokens, function(token) {
            return token.kind === provider;
        });

        user.save(function(err) {
            if (err) return next(err);
            req.flash('info', {
                msg: provider + ' account has been unlinked.'
            });
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
