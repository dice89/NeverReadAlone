/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

var _ = require('lodash');
var path = require('path');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')({
    session: session
});
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var dummyController = require('./controllers/dummy');

/*
 * API keys and Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * CSRF whitelist.
 */

var csrfExclude = ['/url1', '/url2'];

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);

app.use(connectAssets({
    paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
    helperContext: app.locals
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secrets.sessionSecret,
    store: new MongoStore({
        url: secrets.db,
        auto_reconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());

/*
app.use(function(req, res, next) {
  // CSRF protection.
  if (_.contains(csrfExclude, req.path)) return next();
  csrf(req, res, next);
});
*/
app.use(function(req, res, next) {
    // Make user object available in templates.
    res.locals.user = req.user;
    next();
});
app.use(function(req, res, next) {
    // Remember original destination before login.
    var path = req.path.split('/')[1];
    if (/auth|login|logout|signup|fonts|favicon/i.test(path)) {
        return next();
    }
    req.session.returnTo = req.path;
    next();
});
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 1
}));

/**
 * Main routes.
 */

console.log("starting");
app.get('/', homeController.index);

app.get('/test', homeController.test);

//User Management
//

app.post('/login', userController.apiLogin);
app.post('/logout', userController.apiLogout);


app.get('/user/:id', userController.getOneUser);
app.get('/search/:search', userController.search);
app.get('/self', userController.currentUser);

app.post('/user/:id/addRequest', userController.addRequest);
app.get('/auth/linkedin', passport.authenticate('linkedin', {
    state: 'SOME STATE'
}));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    failureRedirect: '/login'
}), function(req, res) {
    res.redirect('/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/login'
}), function(req, res) {
    res.redirect('/');
});


app.post('/user/create', userController.createUser);
app.get('/user', userController.getUser);
app.get('/dummy', dummyController.index);

app.get('/twitter/:id', userController.getTwitterByID);

app.get('/twitter/handle/:id', userController.getTwitterByHandle );

app.get('/linkedin/:id', userController.getLinkedinSkills);
app.get('/linkedin/recommendations/:id', userController.getLinkedinRecommendations);
app.put('/user', userController.putUser);



/**
 * 500 Error Handler.
 */

app.use(errorHandler());
/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
