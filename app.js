const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

const mongoose = require('mongoose');
const User = require('./models/user.js');
const { nextTick } = require('process');
const mongoDB = "mongodb+srv://jimmy-nomad:bettercallmecraig@nomadsland.ss6yb.mongodb.net/nomadsland?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var session = require('express-session');

// config express-session
var sess = {
  secret: 'bettercallmecraig911',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}

app.use(session(sess));

// Load environment variables from .env
var dotenv = require('dotenv');
dotenv.config();

// Load Passport
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

var userInViews = require('./lib/middleware/userInViews');
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');

// ..
app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
// ..

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.post('/', (req, res) => {
    const { psw } = req.body;
    if (psw == 'bettercallmecraig') {
        res.cookie('access', 1, { maxAge: (3600000 * 24 * 30) });
        res.redirect('login');
    } else {
        res.render('home');
    }
});

app.get('/', (req, res) => {
    if (req.cookies.access){
        res.redirect('login');
    }else{
        res.render('home');
    }
});

app.get('/login', (req, res) => {
    res.render("login");
})


app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/signup', (req, res) => {
    const{ username, psw, phone } = req.body;
    res.send(username + " : " + psw )
})

app.get('/logo', (req, res) => {
    res.send("<img src='images/jimmy-nomad-logo-square.jpeg'></img>");
})

app.get('/welcome', (req, res) => {
    res.render('welcome');
})

app.get('/callback', (req, res) => {
    res.redirect('welcome');
})
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log("app listening....");
});

