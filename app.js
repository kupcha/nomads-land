const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const dotenv = require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');

app.use(
    auth({
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
        idpLogout: true,
        authRequired: false,
        auth0Logout: true
    })
);

const mongoose = require('mongoose');
const User = require('./models/user.js');
const { nextTick, env } = require('process');
const mongoDB = "mongodb+srv://jimmy-nomad:bettercallmecraig@nomadsland.ss6yb.mongodb.net/nomadsland?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', requiresAuth(), (req, res) => {
    req.oidc.isAuthenticated() ? res.redirect('welcome') : res.redirect('login');
});

app.post('/', requiresAuth(), (req, res) => {
    req.oidc.isAuthenticated() ? res.redirect('welcome') : res.redirect('login');
})

app.get('/logo', (req, res) => {
    res.send("<img src='images/jimmy-nomad-logo-square.jpeg'></img>");
})


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

