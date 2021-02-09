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

const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'KzUgcUH58ekEZE19szOQM-0oc8g5saJNGSYTSNCPTOXvsDUZgCE6iD507COrOHLS',
  baseURL: 'https://nomadsland-env.eba-sgsdjyz3.us-east-1.elasticbeanstalk.com',
  clientID: 'rilqQv6b8h1Tnr1NAXd8Kqe8uX48Bkay',
  issuerBaseURL: 'https://dev-51-wtmvz.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});


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

