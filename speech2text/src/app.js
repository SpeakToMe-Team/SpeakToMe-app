var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
//var MongoStore = require('connect-mongo')(session);

var configDB = require('./config/database.js');
//console.log("**** url mongo db : ", configDB.url);

/*var db = mongoose.connect(configDB.url, {
    useMongoClient: true
}, function(err, db){
    console.log('*************** Connexion à la base mongo ****');

    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log("Connected successfully to server", configDB.url);
        var collection = db.collection('users');
  
        console.log("Print persons collection:- ");
  
        collection.find({}).toArray(function(err, person) {
            console.log(JSON.stringify(person, null, 2));
        });
  
        db.close();
    }
});*/

var promise = mongoose.connect(configDB.url, {
    useMongoClient: true
});

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
                    secret: 'anystringoftext',
                    saveUninitialized: true,
                    resave: true/*,
                    store: new MongoStore({
                        mongooseConnection: mongoose.connection,
                        ttl : 2 * 24 * 60 * 60    
                    })*/
                }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user || null;
    next();
});
/*
app.use(function(req, res, next){
    console.log(req.session);
    console.log('=========================');
    console.log(req.user);
    next();
});*/

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var api = express.Router();
require('./app/routes/api')(api, passport);
app.use('/api', api);

var auth = express.Router();
require('./app/routes/auth')(auth, passport);
app.use('/auth', auth);

var secure = express.Router();
require('./app/routes/secure')(secure, passport);
app.use('/', secure);

//require('./app/routes')(app, passport);

var server = app.listen(port);

var io = require('socket.io').listen(server);

// define interactions with client
io.on('connection', function (socket) {
    console.log("un client vient de se connecter.");
    //send data to client
   // setInterval(function () {
       
    //}, 1000);

    socket.on('message', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
         socket.emit('message', { 'title': "Bienvenue avec socket.io !" });
    });	

});

console.log('Server running on port: ' + port);