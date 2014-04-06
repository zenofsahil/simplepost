
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var mods = require('./mods');
var userAuth = mods.userAuthentication;

var db = mysql.createConnection({
	host: '',
	user :'root',
	password: 'rootpassword',
	database: 'database'
});

db.connect();

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.bodyParser());
app.use(express.logger('short'));
//app.use(express.logger('>>:date - :remote-addr - :referrer - :method :status :url [":user-agent"]'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: "SECRET"}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index(db));
app.get('/post', userAuth, routes.post);
app.post('/post', userAuth, routes.makepost(db));
app.get('/login', routes.loginpage);
app.post('/login', routes.login(db));
app.get('/register', routes.usersignup);
app.post('/register', routes.registeruser(db));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
