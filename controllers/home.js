var Twit = require('twit');
var _ = require('lodash');
var secrets = require('../config/secrets');
var User = require('../models/User');
var logic = require('../logic');
var glossary = require("glossary")({ collapse: true, blacklist: ["article", "topic", "time", "answer", "week"]});

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

exports.keywords = function(req, res) {
	var keywords = glossary.extract(req.body.topic);
    res.json({
        'keywords': keywords
    });
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
    T.get('/statuses/user_timeline', {
        user_id: twitter_id,
        count: 100
    }, function(err, reply) {
        var tweetText = "";


        reply.forEach(function(element) {
            tweetText = tweetText + element.text;
        });

        var words = logic.process(tweetText);
        console.log(words);
        if (err) return next(err);
        res.json(words);
    });
};
