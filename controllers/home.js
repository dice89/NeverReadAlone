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
    if (!req.user) res.redirect('/');
    User.find({}, function(err, data) {
        console.log(err);
        console.log(data);
        var token = _.find(req.user.tokens, {
            kind: 'twitter'
        });
        var user_id = req.param('id');
        var T = new Twit({
            consumer_key: secrets.twitter.consumerKey,
            consumer_secret: secrets.twitter.consumerSecret,
            access_token: token.accessToken,
            access_token_secret: token.tokenSecret
        });


        data.map(function(user) {

            if (user.twitter) {
                T.get('/statuses/user_timeline', {
                    user_id: user.twitter,
                    count: 100
                }, function(err, reply) {
                    var tweetText = "";

                    reply.forEach(function(element) {
                        tweetText = tweetText + element.text;
                    });

                    var words = logic.process(tweetText);

                    var words_array = [];
                    words.map(function(elm) {
                        if (elm.value > 3) {
                            words_array.push(elm.key);
                        }
                    });
                    console.log(words);

                    user.words = words_array;

                    user.save(function(err, data) {
                        if (err) console.log(err);

                    });
                });

            } else if (user.twitter_handle) {
                T.get('/statuses/user_timeline', {
                    screen_name: user.twitter_handle,
                    count: 100
                }, function(err, reply) {
                    var tweetText = "";

                    reply.forEach(function(element) {
                        tweetText = tweetText + element.text;
                    });

                    var words = logic.process(tweetText);

                    var words_array = [];
                    words.map(function(elm) {
                        if (elm.value > 3) {
                            words_array.push(elm.key);
                        }
                    });
                    console.log(words);

                    user.words = words_array;

                    user.save(function(err, data) {
                        if (err) console.log(err);

                    });
                });
            } else {
                T.get('/statuses/user_timeline', {
                    screen_name: 'lc0d3r',
                    count: 100
                }, function(err, reply) {
                    if (reply) {
                        var tweetText = "";

                        reply.forEach(function(element) {
                            tweetText = tweetText + element.text;
                        });

                        var words = logic.process(tweetText);

                        var words_array = [];
                        words.map(function(elm) {
                            if (elm.value > 3) {
                                words_array.push(elm.key);
                            }
                        });
                        console.log(words);

                        user.words = words_array;

                        user.save(function(err, data) {
                            if (err) console.log(err);

                        });
                    }
                });


            }
        });
    });
};
