var express = require("express");
var bodyparser = require("body-parser");
var app = express();
app.use(bodyparser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "Origin, X-requested-With, Content-Type, Accept");
	next();
});

var path = require("path");
app.use(express.static(__dirname + "/"));

app.get("/", function(req,res){
	res.sendFile( __dirname + "/" + "index.html");
});

//toevoegen twitter 
app.get('/tweets', function (request, response) {
var Twit = require('twit');

var T = new Twit({
	consumer_key: '51hx5SDKKbTTgTfQTieRbPXyU',
	consumer_secret: 'DJgdou5UIUB9N5hNNNO0P7iORA3C6Kr7s02aU9NKo9JQnl2UNH',
	access_token: '2496783522-3P12DvSzylixvhPeZWYaKHzkFmxxtNlRjkZIfvp',
	access_token_secret: 'ieN0Gk42qXfEtu8R8vjtSncXTi6GXdc2LdLIkcN5lWwmm',
})

var date = new Date();
date.setDate(date.getDate()-1);
date = date.toISOString().
replace(/\T.+/, '');

  T.get('search/tweets', { q: 'babysit since:2016-01-01', count: 10 }, function (err, data) {
    response.send(data);
  });
});

app.listen(3000);
