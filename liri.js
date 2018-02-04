import { spotify } from './keys';

require('dotenv').config();

var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');

var userInput = "";
var nodeArgs = process.argv;
var command = process.argv[2];
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

for (var i = 2; i < nodeArgs.lengths; i++) {
    if (i > 2 && i < nodeArgs.length) {
        userInput = userInput + "+" + nodeArgs[i];
    } 
    else {
        userInput += nodeArgs[i];
    }
}

switch(command) {
    case "my-tweets":
        showTweets();
    break;
    
    case "spotify-this-song":
    if(userInput) {
        spotifySong(userInput);
    } 
    else {
        spotifySong("The Sign")
    }
    break;

    case "movie-this":
    if(userInput) {
        omdbData(userInput)
    } 
    else {
        omdbData("Mr.Nobody")
    }
    break;

    case "do-what-it-says":
        doThing();
    break;
    
    default:
        console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
    break;    
}

function showTweets() {
    var screenName = {screen_name: 'AnthonyAceCera'};

    client.get('statuses/user_timeline', screenName, function(error, tweets, response) {
        if(error) {
            console.log("Error!");
        } else {
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@AnthonyAceCera: " + tweets[i].text + "Created At: " + date.substring(0,19));

                fs.appendFile('random.txt', "@AnthonyAceCera: " + tweets[i].text + "Created At: " + date.substring(0,19));
            }
        }
    });
}

function spotifySong(song) {
    spotify.search({ type: 'track', query: song}, function(error, data) {
        if (error) {
            console.log("Error!")
        } else {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("Artists: " + songData.artists[0].name);
                console.log("Song: " + songData.name);
                console.log("Preview URL: " + songData.preview_url);
                console.log("Album :" + songData.album.name);

                fs.appendFile('random.txt', songData.artists[0].name);
                fs.appendFile('random.txt', songData.name);
                fs.appendFile('random.txt', songData.preview_url);
                fs.appendFile('random.txt', songData.album.name);
            }
        }
    });
}
request('queryURL', function (error, response, body) {
    if (!error && response.statusCode === 200) {
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
     } //else (nodeArgs === "")
    //     console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    //     console.log("It's on Netflix!");
});

