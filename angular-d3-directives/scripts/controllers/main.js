'use strict';

angular.module('examplesApp')
    .controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
        var dummy = [{
            "key": "rt",
            "value": 4
        }, {
            "key": "pj",
            "value": 1
        }, {
            "key": "need",
            "value": 1
        }, {
            "key": "influencers",
            "value": 1
        }, {
            "key": "dr",
            "value": 1
        }, {
            "key": "hubert",
            "value": 4
        }, {
            "key": "burda",
            "value": 6
        }, {
            "key": "burdahackday",
            "value": 3
        }, {
            "key": "qnoveydxdjrt",
            "value": 1
        }, {
            "key": "last",
            "value": 1
        }, {
            "key": "people",
            "value": 1
        }, {
            "key": "standing",
            "value": 1
        }, {
            "key": "beim",
            "value": 1
        }, {
            "key": "late",
            "value": 1
        }, {
            "key": "night",
            "value": 1
        }, {
            "key": "hacking",
            "value": 1
        }, {
            "key": "rwbthtwsfrt",
            "value": 1
        }, {
            "key": "berndoswald",
            "value": 1
        }, {
            "key": "und",
            "value": 4
        }, {
            "key": "meine",
            "value": 1
        }, {
            "key": "familie",
            "value": 1
        }, {
            "key": "ich",
            "value": 1
        }, {
            "key": "haben",
            "value": 1
        }, {
            "key": "die",
            "value": 1
        }, {
            "key": "coder",
            "value": 1
        }, {
            "key": "eine",
            "value": 1
        }, {
            "key": "yourself",
            "value": 1
        }, {
            "key": "kochrezepte",
            "value": 1
        }, {
            "key": "app",
            "value": 1
        }, {
            "key": "gebaut",
            "value": 1
        }, {
            "key": "qkrf",
            "value": 1
        }, {
            "key": "karbasa",
            "value": 2
        }, {
            "key": "ein",
            "value": 1
        }, {
            "key": "toller",
            "value": 1
        }, {
            "key": "vortrag",
            "value": 1
        }, {
            "key": "von",
            "value": 1
        }, {
            "key": "hans",
            "value": 1
        }, {
            "key": "fink",
            "value": 1
        }, {
            "key": "ceo",
            "value": 1
        }, {
            "key": "intermedia",
            "value": 1
        }, {
            "key": "zu",
            "value": 1
        }, {
            "key": "vc",
            "value": 1
        }, {
            "key": "start",
            "value": 1
        }, {
            "key": "up",
            "value": 1
        }, {
            "key": "bewertungen",
            "value": 1
        }, {
            "key": "bei",
            "value": 1
        }, {
            "key": "burda_bootcamp",
            "value": 3
        }, {
            "key": "zrkkxz",
            "value": 1
        }, {
            "key": "wie",
            "value": 1
        }, {
            "key": "computer",
            "value": 1
        }, {
            "key": "unsere",
            "value": 1
        }, {
            "key": "opendatahackday",
            "value": 2
        }, {
            "key": "hle",
            "value": 1
        }, {
            "key": "verstehen",
            "value": 1
        }, {
            "key": "analysieren",
            "value": 1
        }, {
            "key": "dibdrhhm",
            "value": 1
        }, {
            "key": "via",
            "value": 1
        }, {
            "key": "huffpostdert",
            "value": 1
        }, {
            "key": "trendsmap",
            "value": 1
        }, {
            "key": "wow",
            "value": 1
        }, {
            "key": "views",
            "value": 1
        }, {
            "key": "indyref",
            "value": 1
        }, {
            "key": "visualisation",
            "value": 1
        }, {
            "key": "far",
            "value": 1
        }, {
            "key": "now",
            "value": 1
        }, {
            "key": "there",
            "value": 1
        }, {
            "key": "quite",
            "value": 1
        }, {
            "key": "ending",
            "value": 1
        }, {
            "key": "mxwtnwnu",
            "value": 1
        }, {
            "key": "bootcamp",
            "value": 1
        }, {
            "key": "guys",
            "value": 1
        }, {
            "key": "meeting",
            "value": 2
        }, {
            "key": "nikolasburk",
            "value": 3
        }, {
            "key": "timsuchanek",
            "value": 2
        }, {
            "key": "alexcmueller",
            "value": 1
        }, {
            "key": "thomasjanek",
            "value": 1
        }, {
            "key": "ohwl",
            "value": 1
        }, {
            "key": "gives",
            "value": 1
        }, {
            "key": "introduction",
            "value": 1
        }, {
            "key": "state",
            "value": 1
        }, {
            "key": "art",
            "value": 1
        }, {
            "key": "web",
            "value": 1
        }, {
            "key": "development",
            "value": 1
        }, {
            "key": "gvvedczmujust",
            "value": 1
        }, {
            "key": "met",
            "value": 1
        }, {
            "key": "burda_hubert",
            "value": 1
        }, {
            "key": "burda_bootcamprt",
            "value": 2
        }, {
            "key": "today",
            "value": 1
        }, {
            "key": "mertesacker",
            "value": 1
        }, {
            "key": "eistonne",
            "value": 1
        }, {
            "key": "tag",
            "value": 1
        }, {
            "key": "uft",
            "value": 1
        }, {
            "key": "ice",
            "value": 1
        }, {
            "key": "cubes",
            "value": 1
        }, {
            "key": "day",
            "value": 1
        }, {
            "key": "work",
            "value": 1
        }, {
            "key": "progress",
            "value": 1
        }, {
            "key": "bfg",
            "value": 1
        }, {
            "key": "wc",
            "value": 1
        }, {
            "key": "fussballerfloskeln",
            "value": 1
        }, {
            "key": "dfb_team",
            "value": 1
        }, {
            "key": "gef",
            "value": 1
        }]


        var wordlist = [];

        dummy.map(function(elm){
            if(elm.value > 3){
                wordlist.push(elm.key);
            }
        })

        $scope.words = wordlist;
        $scope.myOnClickFunction = function(element) {
            console.log("click", element);
        }

        $scope.myOnHoverFunction = function(element) {
            console.log("hover", element);
        }
    }]);
