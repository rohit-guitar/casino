var express = require('express');
var path = require('path');
var mysql = require('mysql');
var swig  = require('swig');
// var fs  = require('fs');

// var tunnel = require('./routes/tunnel');
// var sequest = require('sequest')
var bodyParser = require('body-parser'),
	hostname = process.env.HOSTNAME || 'localhost',
    port = 3000,
    publicDir = process.argv[2] || __dirname ;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(publicDir));
app.use(express.static(path.join(__dirname, '/public')));

var con = mysql.createConnection({
  host: "173.194.232.115",
  user: "root",
  password: "casino",
  database : "casino"
});

con.connect(function(err){
    if(err){
    	console.log('Error connecting to Db', err);
    	return;
    }
	  	console.log('Connection established');
	  	con.query('SELECT * FROM team',function(err,rows){
	  	if(err) throw err;
		console.log('Data received from Db:\n');
		console.log(rows);
	});
});


app.get('/', function(req, res, next) {
  	res.render('index', { pagename: 'Casino',
    authors: ['Paul', 'Jim', 'Jane']});
});	

module.exports = app;
app.listen(process.env.PORT || 3000);

