var Client = require('node-rest-client').Client;
var client = new Client();
var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8000;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

var configDB = require('./config/database.js');

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
                    resave: true,
                    store: new MongoStore({
                        mongooseConnection: mongoose.connection,
                        ttl : 2 * 24 * 60 * 60
                    })
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

app.use('/speech2text', express.static(path.join(__dirname, 'assets')));
app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var api = express.Router();
require('./app/routes/api')(api, passport);
app.use('/api', api);

var auth = express.Router();
require('./app/routes/auth')(auth, passport);
app.use('/speech2text/auth', auth);

var secure = express.Router();
require('./app/routes/secure')(secure, passport);
app.use('/speech2text', secure);


var server = app.listen(port);

/* Partie Socket.Io */
var io = require('socket.io')(server, { path: '/speech2text/socket.io'}).listen(server);
io.on('connection', function (socket) {
    console.log("un client vient de se connecter.");
    /* setInterval(function () { }, 1000); */

    socket.on('message', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
         socket.emit('message', { 'title': "Bienvenue avec socket.io !" });
    });

    socket.on('question', function (question) {

        var args = {
            path: { "query": question }
        };

        client.get("http://frontend/api/speech?query=${query}", args,
        function (data, response) {
            // parsed response body as js object
            console.log(data);
            // raw response
            //console.log(response);


            //var json = '{"intent":"weather","response":{"city":{"id":2968254,"name":"Villeurbanne","coord":{"lon":4.8833,"lat":45.7667},"country":"FR","population":131445},"cod":"200","message":3.8103816,"cnt":15,"list":[{"dt":1503831600,"temp":{"day":32.07,"min":19.61,"max":32.68,"night":19.61,"eve":28.86,"morn":25.24},"pressure":987.83,"humidity":46,"weather":[{"id":500,"main":"Rain","description":"l\u00e9g\u00e8res pluies","icon":"10d"}],"speed":3.92,"deg":32,"clouds":48,"rain":0.23,"verbose":"27-08-17"},{"dt":1503918000,"temp":{"day":31.61,"min":18.26,"max":32.53,"night":18.96,"eve":29.09,"morn":18.26},"pressure":986.12,"humidity":41,"weather":[{"id":801,"main":"Clouds","description":"peu nuageux","icon":"02d"}],"speed":1.93,"deg":33,"clouds":12,"verbose":"28-08-17","display":true},{"dt":1504004400,"temp":{"day":31.21,"min":18.15,"max":33.1,"night":23.42,"eve":30.06,"morn":18.15},"pressure":984.02,"humidity":42,"weather":[{"id":802,"main":"Clouds","description":"partiellement ensoleill\u00e9","icon":"03d"}],"speed":1.77,"deg":80,"clouds":36,"verbose":"29-08-17"},{"dt":1504090800,"temp":{"day":32.42,"min":18.51,"max":32.42,"night":18.51,"eve":22.74,"morn":20.35},"pressure":984.11,"humidity":36,"weather":[{"id":501,"main":"Rain","description":"pluies mod\u00e9r\u00e9es","icon":"10d"}],"speed":3.27,"deg":184,"clouds":12,"rain":10.56,"verbose":"30-08-17"},{"dt":1504177200,"temp":{"day":14.19,"min":12.38,"max":14.21,"night":12.38,"eve":14.04,"morn":14.21},"pressure":984.45,"humidity":0,"weather":[{"id":502,"main":"Rain","description":"fortes pluies","icon":"10d"}],"speed":2.52,"deg":333,"clouds":100,"rain":40.95,"verbose":"31-08-17"},{"dt":1504263600,"temp":{"day":17.45,"min":8.81,"max":17.45,"night":8.81,"eve":15.54,"morn":11.62},"pressure":985.3,"humidity":0,"weather":[{"id":500,"main":"Rain","description":"l\u00e9g\u00e8res pluies","icon":"10d"}],"speed":5.05,"deg":347,"clouds":5,"rain":0.59,"verbose":"01-09-17"},{"dt":1504350000,"temp":{"day":17.62,"min":6.93,"max":17.62,"night":12.38,"eve":15.71,"morn":6.93},"pressure":978.55,"humidity":0,"weather":[{"id":500,"main":"Rain","description":"l\u00e9g\u00e8res pluies","icon":"10d"}],"speed":1.64,"deg":60,"clouds":89,"rain":0.89,"verbose":"02-09-17"},{"dt":1504436400,"temp":{"day":19.16,"min":12.47,"max":19.16,"night":13.26,"eve":18.1,"morn":12.47},"pressure":975.27,"humidity":0,"weather":[{"id":500,"main":"Rain","description":"l\u00e9g\u00e8res pluies","icon":"10d"}],"speed":2.03,"deg":159,"clouds":81,"rain":0.86,"verbose":"03-09-17"},{"dt":1504522800,"temp":{"day":19.59,"min":11.88,"max":19.59,"night":11.88,"eve":15.39,"morn":12.08},"pressure":974.93,"humidity":0,"weather":[{"id":502,"main":"Rain","description":"fortes pluies","icon":"10d"}],"speed":4.4,"deg":228,"clouds":32,"rain":12.3,"verbose":"04-09-17"},{"dt":1504609200,"temp":{"day":16.99,"min":8.84,"max":16.99,"night":8.84,"eve":15.92,"morn":11.13},"pressure":982.67,"humidity":0,"weather":[{"id":500,"main":"Rain","description":"l\u00e9g\u00e8res pluies","icon":"10d"}],"speed":2.62,"deg":318,"clouds":54,"rain":2.74,"verbose":"05-09-17"},{"dt":1504695600,"temp":{"day":20.38,"min":7.75,"max":20.38,"night":10.7,"eve":18.5,"morn":7.75},"pressure":986.35,"humidity":0,"weather":[{"id":500,"main":"Rain","description":"l\u00e9g\u00e8res pluies","icon":"10d"}],"speed":1.02,"deg":275,"clouds":11,"verbose":"06-09-17"},{"dt":1504782000,"temp":{"day":25.48,"min":9.65,"max":25.48,"night":15.27,"eve":21.98,"morn":9.65},"pressure":987.2,"humidity":0,"weather":[{"id":800,"main":"Clear","description":"ciel d\u00e9gag\u00e9","icon":"01d"}],"speed":3.03,"deg":193,"clouds":0,"verbose":"07-09-17"},{"dt":1504868400,"temp":{"day":25.66,"min":13.54,"max":25.66,"night":17.68,"eve":23.65,"morn":13.54},"pressure":982.06,"humidity":0,"weather":[{"id":500,"main":"Rain","description":"l\u00e9g\u00e8res pluies","icon":"10d"}],"speed":6.32,"deg":176,"clouds":0,"rain":1.21,"verbose":"08-09-17"},{"dt":1504954800,"temp":{"day":19.33,"min":14.12,"max":19.33,"night":14.12,"eve":16.88,"morn":14.66},"pressure":973.73,"humidity":0,"weather":[{"id":502,"main":"Rain","description":"fortes pluies","icon":"10d"}],"speed":1.63,"deg":125,"clouds":42,"rain":46.33,"verbose":"09-09-17"},{"dt":1505041200,"temp":{"day":17.05,"min":11.02,"max":17.05,"night":11.02,"eve":14.36,"morn":14.26},"pressure":966.37,"humidity":0,"weather":[{"id":502,"main":"Rain","description":"fortes pluies","icon":"10d"}],"speed":3.97,"deg":303,"clouds":58,"rain":12.24,"verbose":"10-09-17"}],"aqi":{"station":"Villeurbanne Place Grandclement","index":17,"msg":"info","rawdata":{"status":"ok","data":{"aqi":17,"idx":3035,"attributions":[{"url":"http:\/\/www.air-rhonealpes.fr\/","name":"Observatoire Air Rhone-Alpes"}],"city":{"geo":[45.758413661765,4.886215308064],"name":"Villeurbanne Place Grandclement","url":"http:\/\/aqicn.org\/city\/france\/rhonealpes\/rhone\/villeurbanne-place-grandclement\/"},"dominentpol":"pm10","iaqi":{"h":{"v":60},"no2":{"v":14.2},"p":{"v":990.71},"pm10":{"v":17},"t":{"v":22.11}},"time":{"s":"2017-08-27 08:00:00","tz":"+01:00","v":1503820800}}}}}}';
            socket.emit('anwser', data);

        });



        /* En attendant que l'adresse 127.0.01.nip.io soit dispo : on charge des données récupérées depuis le navigateur */
        /* Quand l'adresse 127.0.01.nip.io sera disponible
        var url = 'http://127.0.0.1.nip.io/api/speech?query='+question;
        $.getJSON( url, function( data ) {
            if(data.length > 0){
                var items = [];
                let module = data.intent;

                // Réinit à chaque fois
                dashboard.init();

                switch(module) {
                    case 'weather':
                        console.log('module weather');
                        console.log(jsonWeather);
                        dashboard.isActiveWeatherModule = true;
                        break;
                    case 'travel':
                        console.log("module travel");
                        dashboard.isActiveTravelModule = true;
                        break;
                    case 'movie':
                        console.log("module movie");
                        dashboard.isActiveMovieModule = true;
                        break;
                    case 'music':
                        console.log("module music");
                        dashboard.isActiveMusicModule = true;
                        break;
                    default:
                        console.log("désolé je n'ai pas compris...");
                        break;
                }
            }
        });*/


    });

});

console.log('Server running on port: ' + port);
