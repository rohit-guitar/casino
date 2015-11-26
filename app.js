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
	  				res.render('login',{error:"Authentication Failed!"});
	  			}
	  			else{
		  			res.redirect('/index');	
	  			}
	  		}
		});
  		
	});
	
	app.get("/teams/all",function(req,res,next){
		con.query("select distinct Name from ( select name from team2005 union select name from team2006 union select name from team2007 union select name from team2008 union select name from team2009) t3",
	  		function(err,rows){
	  		if(err) 
	  		{
	  			console.log("Error encountered : ",err);
	  			throw err;
	  		}
	  		else{
	  			var teams = [];
	  			var i=0;
	  			rows.forEach(function(row){
	  				teams[i++] = row.Name;
	  				// teams[i] = teams[i].replace(/"/g, "")
	  			})
	  			// console.log(teams);
	  			res.send(teams);	
	  		}
		});
	});	

	app.post("/teams/performance",function(req,res,next){
		var team = req.body.team;
		var attribute = req.body.attribute;
		con.query("select `Date`, `"+attribute+"` from game2005 ,statsMerged2  where game2005.`Game Code` = statsMerged2.`Game Code` and game2005.`Game Code` in (select `Game Code` from statsMerged2 where `Team Code` in (select `Team Code` from (select `Team Code` from team2005 where `Name`='"+team+"' union select `Team Code` from team2006 where `Name`='"+team+"' union select `Team Code` from team2007 where `Name`='"+team+"' union select `Team Code` from team2008 where `Name`='"+team+"' union select `Team Code` from team2009 where `Name`='"+team+"')a))"+
					"union "+
					"select `Date`, `"+attribute+"` from game2006 ,statsMerged2  where game2006.`Game Code` = statsMerged2.`Game Code` and game2006.`Game Code` in (select `Game Code` from statsMerged2 where `Team Code` in (select `Team Code` from (select `Team Code` from team2005 where `Name`='"+team+"' union select `Team Code` from team2006 where `Name`='"+team+"' union select `Team Code` from team2007 where `Name`='"+team+"' union select `Team Code` from team2008 where `Name`='"+team+"' union select `Team Code` from team2009 where `Name`='"+team+"')a))"+
					"union "+
					"select `Date`, `"+attribute+"` from game2007 ,statsMerged2  where game2007.`Game Code` = statsMerged2.`Game Code` and game2007.`Game Code` in (select `Game Code` from statsMerged2 where `Team Code` in (select `Team Code` from (select `Team Code` from team2005 where `Name`='"+team+"' union select `Team Code` from team2006 where `Name`='"+team+"' union select `Team Code` from team2007 where `Name`='"+team+"' union select `Team Code` from team2008 where `Name`='"+team+"' union select `Team Code` from team2009 where `Name`='"+team+"')a))"+
					"union "+
					"select `Date`, `"+attribute+"` from game2008 ,statsMerged2  where game2008.`Game Code` = statsMerged2.`Game Code` and game2008.`Game Code` in (select `Game Code` from statsMerged2 where `Team Code` in (select `Team Code` from (select `Team Code` from team2005 where `Name`='"+team+"' union select `Team Code` from team2006 where `Name`='"+team+"' union select `Team Code` from team2007 where `Name`='"+team+"' union select `Team Code` from team2008 where `Name`='"+team+"' union select `Team Code` from team2009 where `Name`='"+team+"')a))"+
					"union "+
					"select `Date`, `"+attribute+"` from game2009 ,statsMerged2  where game2009.`Game Code` = statsMerged2.`Game Code` and game2009.`Game Code` in (select `Game Code` from statsMerged2 where `Team Code` in (select `Team Code` from (select `Team Code` from team2005 where `Name`='"+team+"' union select `Team Code` from team2006 where `Name`='"+team+"' union select `Team Code` from team2007 where `Name`='"+team+"' union select `Team Code` from team2008 where `Name`='"+team+"' union select `Team Code` from team2009 where `Name`='"+team+"')a))"+
					"union "+
					"select `Date`, `"+attribute+"` from game2010 ,statsMerged2  where game2010.`Game Code` = statsMerged2.`Game Code` and game2010.`Game Code` in (select `Game Code` from statsMerged2 where `Team Code` in (select `Team Code` from (select `Team Code` from team2005 where `Name`='"+team+"' union select `Team Code` from team2006 where `Name`='"+team+"' union select `Team Code` from team2007 where `Name`='"+team+"' union select `Team Code` from team2008 where `Name`='"+team+"' union select `Team Code` from team2009 where `Name`='"+team+"')a))"+
					"union "+
					"select `Date`, `"+attribute+"` from game2011 ,statsMerged2  where game2011.`Game Code` = statsMerged2.`Game Code` and game2011.`Game Code` in (select `Game Code` from statsMerged2 where `Team Code` in (select `Team Code` from (select `Team Code` from team2005 where `Name`='"+team+"' union select `Team Code` from team2006 where `Name`='"+team+"' union select `Team Code` from team2007 where `Name`='"+team+"' union select `Team Code` from team2008 where `Name`='"+team+"' union select `Team Code` from team2009 where `Name`='"+team+"')a))"+
					"union "+
					"select `Date`, `"+attribute+"` from game2012 ,statsMerged2  where game2012.`Game Code` = statsMerged2.`Game Code` and game2012.`Game Code` in (select `Game Code` from statsMerged2 where `Team Code` in (select `Team Code` from (select `Team Code` from team2005 where `Name`='"+team+"' union select `Team Code` from team2006 where `Name`='"+team+"' union select `Team Code` from team2007 where `Name`='"+team+"' union select `Team Code` from team2008 where `Name`='"+team+"' union select `Team Code` from team2009 where `Name`='"+team+"')a))"+
					"union "+
					"select `Date`, `"+attribute+"` from game2013 ,statsMerged2  where game2013.`Game Code` = statsMerged2.`Game Code` and game2013.`Game Code` in (select `Game Code` from statsMerged2 where `Team Code` in (select `Team Code` from (select `Team Code` from team2005 where `Name`='"+team+"' union select `Team Code` from team2006 where `Name`='"+team+"' union select `Team Code` from team2007 where `Name`='"+team+"' union select `Team Code` from team2008 where `Name`='"+team+"' union select `Team Code` from team2009 where `Name`='"+team+"')a));",
	  		function(err,rows){
	  		if(err) 
	  		{
	  			console.log("Error encountered : ",err);
	  			throw err;
	  		}
	  		else{
	  			res.send(rows);	
	  		}
		});
		console.log("REQ BODY **** ",req.body.team, req.body.attribute);
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
app.get("/teams",function(req,res,next){
	res.render('teams')
});


module.exports = app;
app.listen(process.env.PORT || 3000);

