var github = require('octonode');

var request = require('request');


var client = github.client({
    username: 'mannheim123',
    password: 'test1234'
});

var DBUser = require('./models/User');
var mongoose = require('mongoose');



var secrets = require('./config/secrets');



/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var ghsearch = client.search();


ghsearch.repos({
    q: 'language:javascript',
    sort: 'stars',
    order: 'desc'
}, function(err, data, headers) {
    console.log("error: " + err);

    console.log(data.total_count);

    if (data.items.length > 0) {
        data.items.map(function(elm) {
            console.log(elm.full_name);
            //console.log(elm.stargazers_count);

            //get contributers
            //
            var ghrepo = client.repo(elm.full_name);


            ghrepo.contributors(function(err, data, header) {
                console.log(data);
                console.log(err);
                var contributors = data;


                ghrepo.languages(function(err, languages, header) {

                    var merged_language = ""
                    for (key in languages) {
                        merged_language = merged_language + " " + key;
                    }
                    console.log(merged_language);
                    if (contributors) {
                        contributors.map(function(user) {
                            //console.log(data);
                            //
                            var ghuser = client.user(user.login);
                            ghuser.info(function(err, userdetail, header) {
                                if (userdetail) {
                                    if (userdetail.location) {
                                        //console.log(userdetail.location);
                                        var mapboxurl = "http://www.mapquestapi.com/geocoding/v1/address?location=" + userdetail.location + "&key=Fmjtd%7Cluurnu0z2q%2C22%3Do5-9w82gw";
                                        var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + userdetail.location;
                                        request(mapboxurl, function(err, res, body) {
                                            // console.log(body);
                                            //console.log(err);
                                            var json = undefined;
                                            try {

                                                json = JSON.parse(body);
                                            } catch (err) {
                                                console.log("error");
                                            }


                                            if (json) {

                                                if (json.results[0]) {

                                                    if (json.results[0].locations[0]) {
                                                        //console.log(json.results[0].locations[0].latLng);
                                                        var geo = json.results[0].locations[0].latLng;
                                                        console.log(userdetail);
                                                        var dbuser = new DBUser({
                                                            email: userdetail.email,
                                                            github: userdetail.login,
                                                            expertise: merged_language,
                                                            profile: {
                                                                name: userdetail.name,
                                                                picture: userdetail.avatar_url
                                                            },
                                                            geo: {
                                                                type: "Point",
                                                                coordinates: [parseFloat(geo.lng), parseFloat(geo.lat)]
                                                            }
                                                        });

                                                        DBUser.findOne({
                                                            github: userdetail.login
                                                        }, function(err, db_user) {
                                                            console.log("User search");
                                                            if (db_user) {
                                                                db_user.expertise = db_user.expertise + merged_language;
                                                                db_user.save(function(err, data) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                    } else {
                                                                        console.log(merged_language);
                                                                        console.log("user updated");
                                                                        console.log(data);
                                                                    }
                                                                });
                                                            } else {
                                                                dbuser.save(function(err, data) {
                                                                    if (!err) {
                                                                        console.log("user saved");
                                                                        console.log(data);
                                                                    } else {
                                                                        console.log(err);
                                                                    }
                                                                });
                                                            }
                                                        });


                                                    }


                                                }
                                            }
                                        });

                                    }
                                }


                            });
                        });
                    }
                });
            });
        });
    }
}); //array of search results


// /*
// client.get('/user', {}, function (err, status, body, headers) {
//   console.log(body); //json object
// });*/
