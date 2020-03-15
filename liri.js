require("dotenv").config()
var Spotify = require("node-spotify-api")
var keys = require("./keys")
var axios = require("axios")
var moment = require("moment")
var fs = require("fs")
var spotify = new Spotify(keys.spotify)

function getArtist(artist){
return artist.name
}

function getSpotify(songName){
if(songName === undefined){
    songName = "Worlds Apart"
}
spotify.search(
    {
        type: "track", 
        query: songName
    },
    function(err, data){
        if(err) {
            console.log("An error occurred" + err)
            return
        }
        var songs = data.tracks.items
        for(i = 0; i < songs.length; i++){
            console.log("artist: " + songs[i].artists.map(getArtist))
            console.log("songName;" + songs[i].name)
            console.log("previewSong;" + songs[i].preview_url)
            console.log("album;" + songs[i].album.name)
        }
    }
)
}
function getBands(artist){
var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=0376df97a3885aba2ab71b3bdc8a9726";
axios.get(queryURL).then(
   function (response){
       var jsonData = response.data
       if(!jsonData.length){
           console.log("No results found" + artist)
           return;
       }
       for(i = 0; i < jsonData.length; i ++){
           var show = jsonData[i]
           console.log(show.venue.city + (show.venue.region || show.venue.country) + show.venue.name + moment(show.datetime).format("MM/DD/YYYY"))
       }
   } 
)
}
function getMovie(movieName){
if(movieName === undefined){
    movieName = "Titanic"
}
var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

axios.get(urlHit).then(
    function (response){
        var jsonData = response.data
      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
)
}
function dowhatitSays(){
    fs.readFile("random.txt", "utf8", function (error, data){
        var dataArr = data.split(",")
        if(dataArr.length === 2){
            pick(dataArr[0], dataArr[1])
        }
        else if(dataArr.length === 1){
            pick(dataArr[0])
        }
    })
}
function pick(command, data){
switch(command){
    case "concert-this": 
    getBands(data)
    break;
    case "spotify-this-song":
    getSpotify(data)
    break;
    case "movie-this":
    getMovie(data)
    break;
    case "do-what-it-says":
    dowhatitSays()
    break;
    default: 
    console.log("liri doesn't know this function")

}
}
function runThis(arg1, arg2){
    pick(arg1, arg2)
}
runThis(process.argv[2], process.argv.slice(3).join(" "))
