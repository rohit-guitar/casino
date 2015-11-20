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
  database : "casinodb"
});

con.connect(function(err){
    if(err){
    	console.log('Error connecting to Db', err);
    	return;
    }
	console.log('Connection established');
	
	app.post('/login', function(req, res, next) {
	  	// console.log(req.body.email,req.body.password);
	  	con.query('SELECT * FROM users WHERE Email = "'+req.body.email+'" AND password = "'+req.body.password+'"',
	  		function(err,rows){
	  		if(err) 
	  		{
	  			console.log("Error encountered : ",err);
	  			throw err;
	  		}
	  		else{
	  			console.log(rows)
	  			if(rows.length==0){
	  				//Print message 
	  				res.render('login',{error:"AuthFail"});
	  			}
	  			else{
		  			res.redirect('/index');	
	  			}
	  		}
		});
  		
	});	
});

app.get('/', function(req, res, next) {
  	res.render('login');

});	



app.get('/index', function(req, res, next) {
	// If not logged in, go to login page
	//1. Invoke function to talk to Livy server to submit spark job 
	// i) First, check if DB has any data, else trigger spark job
	//2. Get the betting odds and send as variables to index.html

  	res.render('index', { pagename: 'Casino',
    authors: ['Paul', 'Jim', 'Jane']});
});	

module.exports = app;
app.listen(process.env.PORT || 3000);

