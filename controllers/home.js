var Twit = require('twit');
var _ = require('lodash');
var secrets = require('../config/secrets');
var User = require('../models/User');
var logic = require('../logic');

/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {

    if (req.user) {
        res.json({
            message: "Logged In"
        });
    } else {
        res.json({
            message: "Logged Out"
        });
    }
};


exports.test = function(req, res, next) {
    console.log(req.user.tokens);

    var token = _.find(req.user.tokens, {
        kind: 'twitter'
    });
    var T = new Twit({
        consumer_key: secrets.twitter.consumerKey,
        consumer_secret: secrets.twitter.consumerSecret,
        access_token: token.accessToken,
        access_token_secret: token.tokenSecret
    });
    var twitter_id = token.accessToken.substr(0,token.accessToken.indexOf('-'));
    T.get('users/search', {
        q:'Alex Mueller'
    }, function(err, reply) {
        console.log(err);
        res.json(reply);
    });
};
