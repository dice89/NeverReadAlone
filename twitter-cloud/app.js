/* global document process require console */
/* jslint browser:true */

var mongo;

var MongoClient = require('mongodb').MongoClient;

var _callBackPage = "http://127.0.0.1:3000/sessions/callback";

var __dirname = '.';

var path;

/* This app has been developed to run with a locally installed Mongo database,
   OR a MongoLabs database created as a Bluemix service.
   
   The following code checks for process.env.VCAP_SERVICES. If it finds
   the VCAP_SERVICES environment variable it will assume that this code
   is running on Bluemix and find the path for the Mongo database from there.
   
   If it doesn't find that variable, the code assumes it is running on an 
   alternative local deployment. You can switch out the mongo credentials 
   from here to point to whatever Mongod database you like */

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var ml = env.mongolab;
    
    path = ml[0].credentials.uri;
    
    _callBackPage = process.env.TWITTER_ENDPOINT;               
} else {
    mongo = {   "hostname":"127.0.0.1",
                "port":27017,
   	            "username":"",
                "password":"",
                "name":"",
                "db":"expertfinder",
                "url":"mongodb://127.0.0.1:27017/expertfinder" };
                
    path = mongo.url;
}

MongoClient.connect( path, function(err, followersDatabase) {
    
    var port = (process.env.VCAP_APP_PORT || 3000);
    var host = (process.env.VCAP_APP_HOST || 'localhost');
    
    var http = require('http');
    var twit = require("twit");
    var express = require('express');
    var util = require('util');
    var oauth = require('oauth');
    var http = require('http');
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var errorHandler = require('errorhandler');
    var logger = require('morgan');
    var logic = require( './src/logic' );
    var media = require( './src/twitter_update_with_media' );
    
    var multiparty = require('multiparty');
    
    
    if(err) throw err;
    
    var app = express();
    var server = http.createServer(app);

    app.listen(port, function() {
        console.log("Listening on " + port);
    });    

    var consumer = new oauth.OAuth(
        "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
        'QEyHogxFosApsZiVKtg5YYm7O', 'e4OMcys2ESx7dgOD5KiHtu6dlyxN1KiwFN84mvySqbbE8Fmfaw', "1.0A", _callBackPage, "HMAC-SHA1");

        app.use(errorHandler({ dumpExceptions: true, showStack: true }));
        app.use(logger());
        app.use(cookieParser());
        app.use(session({ secret: "very secret" })
    );

    
    app.use(function(req, res, next){
        var err = req.session.error, msg = req.session.success;
        delete req.session.error;
        delete req.session.success;
        res.locals.message = '';
        if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
        if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
        next();
    });

    var makeCommaList = function( followerArray ){

        var csv = '';

        followerArray.forEach( function( item ){
            csv = csv + item + ',';
        });

        csv = csv.substring(0, csv.length - 1);

        return csv;
    }

    var retrieveProfiles = function( config, res, id, cloudType ) {

        /* To begin with this function will retrieve the first 5000
           followers as defined by Twitter's API */

        this.twit = new twit(config);

        var twitterObject = this.twit;

        var followerSets = [];

        var set = [];
        
        var query = 'followers/ids';
        
        switch( cloudType ){
         
            case 'following':
                query = 'friends/ids';
                break;
            
            case 'favorites':
                query = 'favorites/list';
                break;
                
            case 'tweets':
                query = 'statuses/user_timeline';
                break;
            
            default:
                query = 'followers/ids';
                break;
        }
        
        

        this.twit.get(query, { screen_name: id },  function( err, reply, response ){
                        
            var REQUESTS_REMAINING = response.headers['x-rate-limit-remaining'];

            var MAX_SAMPLE_SIZE = 1000;

            followerSets = [];

            var count = 0;

            var totalCount = 0;

            var idList = "";

            var sampleSize;

            if( reply ){
                
                if( query === 'favorites/list' || query === 'statuses/user_timeline' ){
                                        
                    var tweetText = '';

                    
                    reply.forEach( function( element ){
                        tweetText = tweetText + element.text;                        
                    });
                    
                    var words = logic.process( tweetText );                                
                    res.end( JSON.stringify({ outcome: 'success', profiles: words, budget: REQUESTS_REMAINING })); 
                }
                

                if( query === 'followers/ids' || query === 'friends/ids' ){
                
                    set = [];

                    if( reply.ids.length > MAX_SAMPLE_SIZE ){
                        sampleSize = MAX_SAMPLE_SIZE;
                    }else{
                        sampleSize = reply.ids.length;
                    }

                    reply.ids.forEach( function( id ){

                        if( totalCount < sampleSize ){

                            if( count < 100 ){
                                set.push( id );
                            }else{
                                count = 0;
                                followerSets.push( set );
                                set = [];
                                set.push( id );
                            }

                            count++;
                            totalCount++;
                        }
                    })

                    followerSets.push( set );

                    var descriptions = '';

                    var expectedReplies = ( followerSets.length - 1 ) * 100 + count;

                    count = 0;
                    
                    var timer

                    followerSets.forEach( function( set ){

                        var csv = makeCommaList( set );
                        
                        var words;
                        
                        if( timer ){
                            clearTimeout( timer );   
                        }
                        
                        timer = setTimeout( 
                            function(){
                                var words = logic.process( descriptions );                                
                                res.end( JSON.stringify({ outcome: 'success', profiles: words, budget: REQUESTS_REMAINING, pool: expectedReplies }));                       
                                console.log( 'emergency timer' );
                            }, 10000 );
                        
                        twitterObject.get( 'users/lookup', { user_id: csv }, function( usererr, userReply, response ){

                            if( userReply ){
                                userReply.forEach( function( profile ){

                                    descriptions = descriptions + ' ' + profile.description;
                                    count++;
                                    
//                                    console.log( 'count: ' + count );
//                                    console.log( 'expectedReplies: ' + expectedReplies );

                                    if( count === expectedReplies ){

                                        words = logic.process( descriptions );                                
                                        res.end( JSON.stringify({ outcome: 'success', profiles: words, budget: REQUESTS_REMAINING, pool: expectedReplies }));  
                                        
                                        clearTimeout( timer );
                                    }
                                });  
                            }
                        })
                    })
                }
            }

            if( err ){
                console.log( 'retrieval error' );
                console.log( err );
                res.end( JSON.stringify({ outcome: 'failure', profiles: [], budget: REQUESTS_REMAINING }) );  
            }
        })
    }
    
    app.param('image', function(req, res, next, id){    
        
        res.setHeader( 'Content-Type', 'application/json' );
        
        console.log( req.headers );
        
        if( req.headers['image'] ){
            
            var image = req.headers['image'];
            
            console.log( 'new! - received an image: ' + image );
        };
        
        res.end( JSON.stringify({ outcome: 'success' })); 
        
        next();
            
    });
    
    
    app.post( "/tweet", function(req, res ){
        
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
          res.writeHead(200, {'content-type': 'text/plain'});
          res.write('received upload:\n\n');
          res.end(util.inspect({fields: fields, files: files}));
            
            if( fields.image ){
                                
                if( req.session.oauthAccessToken ){
                    
                    var collection = followersDatabase.collection( 'tokens' );

                    collection.findOne( { 'oauth_access_token': req.session.oauthAccessToken }, function( err, item ) {     
                        
                        console.log( 'found' );

                        var config = {
                            consumer_key: process.env.TWITTER_CONSUMER_KEY,
                            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                            token_secret: item.oauth_access_token_secret,
                            token: item.oauth_access_token
                        }
            
                        var image = decodeURIComponent( fields.image[0] );
                        
                        var matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
                        
                        var imageData = new Buffer(matches[2], 'base64');
                        
                        var m = new media(config);

                        m.post( fields.message[0], imageData, function(err, response) {
                          if (err) {
                              
                            console.log( 'ERROR' );
                              
                            console.log(err);
                          }else{
                            console.log( 'SUCCESS' ); 
                          }
                            
                          console.log(response);
                        });
                    });
                }
            }
        });
    } );

    
    app.param('id', function(req, res, next, id){    

        res.setHeader( 'Content-Type', 'application/json' );
        
        console.log( 'access token: ' + req.session.oauthAccessToken );

        if( req.session.oauthAccessToken ){

            var cloudType = req.headers['cloudtype'];
            
            var collection = followersDatabase.collection( 'tokens' );        

            collection.findOne( { 'oauth_access_token': req.session.oauthAccessToken }, function( err, item ) {       
                
                if( item && item.oauth_access_token_secret && item.oauth_access_token ){

                    var config = {
                        consumer_key: process.env.TWITTER_CONSUMER_KEY,
                        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                        access_token_secret: item.oauth_access_token_secret,
                        access_token: item.oauth_access_token
                    }

                    console.log( 'account: ' + item.name );

                    retrieveProfiles( config, res, id, cloudType );   

                    var requests = followersDatabase.collection( 'requests' );

                    var date = new Date();

                    var request = ( { 'twitterId':id, 'timeStamp': date, 'account': item.name } );

                    requests.insert( request, {safe:true}, errorHandler );
                }else{
                 
                    console.log( 'no access token or / and secret' );
                    
                    res.end( JSON.stringify({ outcome: 'failure', profiles: [], budget: 0 }) ); 
                    
//                    res.redirect( '/sessions/connect' );
                    
                }

            });
        }

        next();
    });

    app.get( "/words/:id", function(req, res ){ } );

    app.post("/user/add", function(req, res) {
        res.send("OK");
    });

    app.get('/sessions/connect', function(req, res){


      consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
        if (error) {
          res.send("Error getting OAuth request token : " + util.inspect(error), 500);
        } else {
          req.session.oauthRequestToken = oauthToken;
          req.session.oauthRequestTokenSecret = oauthTokenSecret;
          res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
          console.log( 'get sessions connect' );
        }
      });
    });

   app.get('/sessions/callback', function(req, res){

      consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        
        if( error ){
            
            /* TODO: CREATE AN ERROR PAGE HERE, REQUESTING THEY TRY AGAIN */    
     console.log( error );
            
          res.send("Error getting OAuth access token : " + util.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+util.inspect(results)+"]", 500); 
            
            console.log( results );
            
            console.log( error );
            
//            res.redirect( 'index.html' );
            
        } else {
          req.session.oauthAccessToken = oauthAccessToken;
          req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;    

          console.log( 'get sessions callback' );
          res.redirect( '/profilewords.html' );
        }
      });
    });

    app.get('/', function(req, res){
        
        if( req.session.oauthAccessToken ){
            res.redirect( '/profilewords.html' );
        }else{
            res.sendfile( 'cover.html' );
        }
    });

    app.get('/profilewords.html', function(req, res){

        var twitterVerification = "https://api.twitter.com/1.1/account/verify_credentials.json";
        var token = req.session.oauthAccessToken;
        var secret = req.session.oauthAccessTokenSecret;

        consumer.get( twitterVerification, token, secret, function (error, data, response) {
            
            if( error ){
                
                console.log( 'Twitter verification error\n' );
                console.log( error );
                res.redirect('/sessions/connect');

            } else {

                var parsedData = JSON.parse(data);
                            
                var person = ( {'name':parsedData.screen_name, 
                                'oauth_access_token': req.session.oauthAccessToken, 
                                'oauth_access_token_secret': req.session.oauthAccessTokenSecret } );

                var collection = followersDatabase.collection( 'tokens' );

                collection.remove( { 'name':parsedData.screen_name }, errorHandler );

                collection.insert( person, {safe:true}, errorHandler );

                res.sendfile('profilewords.html');
            }
        });
    });

    var errorHandler = function(err){
        if (err){ console.log(err); }
    };

    /* serves all the static files */
    
    app.get(/^(.+)$/, function(req, res){
         res.sendfile( __dirname + req.params[0]);
    });

    app.use(session({ secret: 'keyboard cat', key: 'sid', cookie: { secure: true }}));

});