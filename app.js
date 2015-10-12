var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'),
	hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 3000,
    publicDir = process.argv[2] || __dirname + '/public';

var app = express();
var swig  = require('swig');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicDir));

// view engine setup
// app.set('view engine', 'jade');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/img',express.static(path.join(__dirname, 'public/images')));
// app.use('/js',express.static(path.join(__dirname, 'public/javascripts')));
// app.use('/css',express.static(path.join(__dirname, 'public/stylesheets')));

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// app.use('/users', users);

module.exports = app;
app.listen(port, hostname);

