var express = require('express');
var path = require('path');
var mysql = require('mysql');
var swig  = require('swig');
var fs  = require('fs');

var tunnel = require('./routes/tunnel');
var sequest = require('sequest')
var bodyParser = require('body-parser'),
	hostname = process.env.HOSTNAME || 'localhost',
    port = process.env.PORT || 3000,
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

var key = fs.readFileSync(process.env.HOME + '/.ssh/google_compute_engine');

sequest('radhikadesai@104.197.111.54', {
  command: 'ls',
  privateKey: key
  }, function (err, stdout) {
    console.log("tunnelPort : ",tunnel())
	// var connection = mysql.createConnection({
 //  		  host     : '104.197.111.54',
	// 	  user     : 'root',
	// 	  password : 'casino',
	// 	  database : 'casinonew'
	// });
	// connection.connect();
});
app.get('/', function(req, res, next) {
	// console.log("connection object : ",connection);
	// connection.query('SELECT Name from conference', function(err, rows, fields) {
 // 	 if (!err)
 //  	  console.log('The solution is: ', rows);
 // 	 else
 //   	 console.log('Error while performing Query.');
	// });
  	res.render('index', { pagename: 'Casino',
    authors: ['Paul', 'Jim', 'Jane']});
});	
// app.use('/users', users)

module.exports = app;
app.listen(port, hostname);

