require("dotenv").config();

var keys = require("./keys");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var spotify = new Spotify(keys.Spotify);

var writeToLog = function(data) {
    fs.appendFile("log.txt", JSON.stringify(data) + "\n", function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("log.txt was updated!");
    });
};

var getArtistNames = function(artist) {
    return artist.name;
};

var getMeSpotify = function(songName) {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search(
        {
            type: "track", 
            query: songName
        }, 
        function(err, data) {
            if (err) {
                console.log("Error ocurred: " + err);
                return;
            }

            var songs = data.tracks.items;
            var data = [];

            for (var i = 0; i < songs.length; i++) {
                data.push({
                    "artist(s)": songs[i].artists.map(getArtistNames),
                    "song name": songs[i].name,
                    "preview song": songs[i].preview_url,
                    "album": song[i].album.name
                });
            }
            console.log(data);
            writeToLog(data);
        });
};

var getMyTweets = function() {
    var client = new Twitter(keys.twitter);

    var params = {
        screen_name: "AnthonyAceCera"
    };
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) {
            var data = [];
            for (var i = 0; i < tweets.length; i++) {
                data.push({
                    created_at: tweets[i].created_at,
                    text: tweets[i].text
                });
            }

            console.log(data);
            writeToLog(data);
        }
    });
};

var getMovie = function(movieName) {
    if (movieName === undefined) {
        movieName = "The Room";
    }

    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    request(urlHit, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonData = json.parse(body);

            var data = {
                "Title:": jsonData.Title,
                "Year:": jsonData.Year,
                "Rated:": jsonData.Rated,
                "IMDB Rating:": jsonData.imdbRating,
                "Country:": jsonData.Country,
                "Language:": jsonData.Language,
                "Plot:": jsonData.Plot,
                "Actors:": jsonData.Actors,
                "Rotton Tomatoes Rating:": jsonData.Ratings[1].Value
              };
              console.log(data);
              writeToLog(data);        
        }
    });
};

var doWhatItSays = function() {
    fs.readFile("random.txt", "uff8", function(error, data) {
        console.log(data);

        var dataArr = data.split(",");
        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    }); 
};

var userChoice = function(caseData, functionData) {
    switch (caseData) {
        case "my-tweets":
            getMyTweets();
        break;
        case "spotify-this-song":
            getMeSpotify(functionData);
        break;
        case "movie-this":
            getMovie(functionData);
        break;
        case "do-what-it-says":
            doWhatItSays();
        break;
        default:
            console.log("LIRI doesn't know that command");
    }
};

var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);
