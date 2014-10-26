var github = require('octonode');

var request = require('request');


var client = github.client({
    username: 'dice89',
    password: 'nintendo89'
});




var ghsearch = client.search();


ghsearch.repos({
    q: 'language:go',
    sort: 'stars',
    order: 'desc'
}, function(err, data, headers) {
    console.log("error: " + err);

    console.log(data.total_count);

    if (data.items.length > 0) {
        data.items.map(function(elm) {
            //console.log(elm.full_name);
            //console.log(elm.stargazers_count);

            //get contributers
            //
            var ghrepo = client.repo(elm.full_name);


            ghrepo.contributors(function(err, data, header) {

                var contributors = data;


                ghrepo.languages(function(err, languages, header) {

                    var merged_language = ""
                    for (key in languages) {
                        merged_language = merged_language + " " + key;
                    }
                    console.log(merged_language);
                    contributors.map(function(user) {
                        //console.log(data);
                        //
                        var ghuser = client.user(user.login);
                        ghuser.info(function(err, userdetail, header) {

                            if (userdetail.location) {
                                console.log(userdetail.location);

                                var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+userdetail.location;
                                request(url, function(err, res, body) {
                                    console.log(body);
                                });

                            }


                        });
                    });
                });
            });
        });
    }
}); //array of search results


/*
client.get('/user', {}, function (err, status, body, headers) {
  console.log(body); //json object
});*/
