var express = require("express");
var bodyparser = require("body-parser");
var request = require("request");
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



app.get("/users/",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});

app.get("/users/1",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/587939441383750.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});


app.get("/users/1/email",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/587939441383750/email.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});


app.get("/users/1/full_name",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/587939441383750/full_name.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});


app.get("/users/1/gender",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/587939441383750/gender.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});

app.get("/users/1/education",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/587939441383750/education.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});

app.get("/users/1/school",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/587939441383750/school.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});

app.get("/users/1/birthday",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/587939441383750/birthday.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});

app.get("/users/1/typeofuser",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/587939441383750/typeofuser.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});



app.get("/users/2",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/10208136626846156.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});


app.get("/users/1/email",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/10208136626846156/email.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});


app.get("/users/2/full_name",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/10208136626846156/full_name.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});


app.get("/users/2/gender",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/10208136626846156/gender.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});

app.get("/users/2/education",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/10208136626846156/education.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});

app.get("/users/2/school",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/10208136626846156/school.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});

app.get("/users/2/birthday",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/10208136626846156/birthday.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});

app.get("/users/2/typeofuser",function(req,res){
	request("https://glaring-fire-6779.firebaseio.com/users/10208136626846156/typeofuser.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.send(JSON.parse(body));
		}
	});
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
