var _ = require('lodash');
var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var OAuthStrategy = require('passport-oauth').OAuthStrategy; // Tumblr
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy; // Venmo, Foursquare
var User = require('../models/User');
var secrets = require('./secrets');
var logic = require('../logic');
var Linkedin = require('node-linkedin')(secrets.linkedin.clientID, secrets.linkedin.clientSecret, secrets.linkedin.callbackURL);



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
// Sign in using Email and Password.

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function(email, password, done) {
    User.findOne({
        email: email
    }, function(err, user) {
        if (!user) return done(null, false, {
            message: 'Email ' + email + ' not found'
        });
        user.comparePassword(password, function(err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Invalid email or password.'
                });
            }
        });
    });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a <provider> id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

// Sign in with Facebook.

passport.use(new FacebookStrategy(secrets.facebook, function(req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        User.findOne({
            facebook: profile.id
        }, function(err, existingUser) {
            if (existingUser) {
                req.flash('errors', {
                    msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
                });
                done(err);
            } else {
                User.findById(req.user.id, function(err, user) {
                    user.facebook = profile.id;
                    user.tokens.push({
                        kind: 'facebook',
                        accessToken: accessToken
                    });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.gender = user.profile.gender || profile._json.gender;
                    user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.save(function(err) {
                        req.flash('info', {
                            msg: 'Facebook account has been linked.'
                        });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({
            facebook: profile.id
        }, function(err, existingUser) {
            if (existingUser) return done(null, existingUser);
            User.findOne({
                email: profile._json.email
            }, function(err, existingEmailUser) {
                if (existingEmailUser) {
                    req.flash('errors', {
                        msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.'
                    });
                    done(err);
                } else {
                    var user = new User();
                    user.email = profile._json.email;
                    user.facebook = profile.id;
                    user.tokens.push({
                        kind: 'facebook',
                        accessToken: accessToken
                    });
                    user.profile.name = profile.displayName;
                    user.profile.gender = profile._json.gender;
                    user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.profile.location = (profile._json.location) ? profile._json.location.name : '';
                    user.save(function(err) {
                        done(err, user);
                    });
                }
            });
        });
    }
}));


passport.use(new LinkedInStrategy(secrets.linkedin, function(req, accessToken, refreshToken, profile, done) {
    console.log("test");
    if (req.user) {
        User.findOne({
            linkedin: profile.id
        }, function(err, existingUser) {

            console.log("found User");
            if (existingUser) {
                done(err);
            } else {
                User.findById(req.user.id, function(err, user) {
                    user.linkedin = profile.id;
                    user.tokens.push({
                        kind: 'linkedin',
                        accessToken: accessToken
                    });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.location = user.profile.location || profile._json.location.name;
                    user.profile.picture = user.profile.picture || profile._json.pictureUrl;
                    user.profile.website = user.profile.website || profile._json.publicProfileUrl;
                    user.save(function(err) {
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({
            linkedin: profile.id
        }, function(err, existingUser) {
            if (existingUser) return done(null, existingUser);
            User.findOne({
                email: profile._json.emailAddress
            }, function(err, existingEmailUser) {
                if (existingEmailUser) {
                    done(err);
                } else {
                    var user = new User();
                    user.linkedin = profile.id;
                    user.tokens.push({
                        kind: 'linkedin',
                        accessToken: accessToken
                    });
                    user.email = profile._json.emailAddress;
                    user.profile.name = profile.displayName;
                    user.profile.location = profile._json.location.name;
                    user.profile.picture = profile._json.pictureUrl;
                    user.profile.website = profile._json.publicProfileUrl;


                    var linkedin = Linkedin.init(accessToken);
                    linkedin.people.me(function(err, $in) {

                        var mergedskills = ""
                        for (key in $in.skills) {
                            for (key2 in $in.skills[key]) {
                                var skill = $in.skills[key][key2];
                                console.log(skill.skill.name);

                                mergedskills = mergedskills + " "+skill.skill.name;
                            }

                        }
                        user.expertise = mergedskills;

                        user.save(function(err) {
                            done(err, user);
                        });
                    });



                }
            });
        });
    }
}));


passport.use(new TwitterStrategy(secrets.twitter, function(req, accessToken, tokenSecret, profile, done) {
    if (req.user) {
        User.findOne({
            twitter: profile.id
        }, function(err, existingUser) {
            if (existingUser) {
                done(err);
            } else {
                User.findById(req.user.id, function(err, user) {
                    user.twitter = profile.id;
                    user.tokens.push({
                        kind: 'twitter',
                        accessToken: accessToken,
                        tokenSecret: tokenSecret
                    });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.location = user.profile.location || profile._json.location;
                    user.profile.picture = user.profile.picture || profile._json.profile_image_url_https;
                    user.save(function(err) {
                        done(err, user);
                    });
                });
            }
        });

    } else {
        User.findOne({
            twitter: profile.id
        }, function(err, existingUser) {
            if (existingUser) return done(null, existingUser);
            var user = new User();
            user.email = profile.username + "@twitter.com";
            user.twitter = profile.id;
            user.tokens.push({
                kind: 'twitter',
                accessToken: accessToken,
                tokenSecret: tokenSecret
            });
            user.profile.name = profile.displayName;
            user.profile.location = profile._json.location;
            user.profile.picture = profile._json.profile_image_url_https;
            user.save(function(err) {
                done(err, user);
            });

        });
    }
}));

// Login Required middleware.

exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
};

// Authorization Required middleware.

exports.isAuthorized = function(req, res, next) {
    var provider = req.path.split('/').slice(-1)[0];

    if (_.find(req.user.tokens, {
            kind: provider
        })) {
        next();
    } else {
        res.redirect('/auth/' + provider);
    }
};
