const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const dotenv = require('dotenv').config();
const { auth } = require('express-openid-connect');

app.use(
    auth({
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
        idpLogout: true,
    })
);

const mongoose = require('mongoose');
const User = require('./models/user.js');
const { nextTick, env } = require('process');
const mongoDB = "mongodb+srv://jimmy-nomad:bettercallmecraig@nomadsland.ss6yb.mongodb.net/nomadsland?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



function login(email, password, callback) {
    const bcrypt = require('bcrypt');
    const MongoClient = require('mongodb@3.1.4').MongoClient;
    const client = new MongoClient('mongodb://jimmy-nomad:bettercallmecraig@nomadsland.ss6yb.mongodb.net/nomadsland?retryWrites=true&w=majority');

    client.connect(function (err) {
        if (err) return callback(err);

        const db = client.db('nomadsland');
        const users = db.collection('users');

        users.findOne({ email: email }, function (err, user) {
            if (err || !user) {
                client.close();
                return callback(err || new WrongUsernameOrPasswordError(email));
            }

            bcrypt.compare(password, user.password, function (err, isValid) {
                client.close();

                if (err || !isValid) return callback(err || new WrongUsernameOrPasswordError(email));

                return callback(null, {
                    user_id: user._id.toString(),
                    nickname: user.nickname,
                    email: user.email
                });
            });
        });
    });
}

function create(user, callback) {
    const bcrypt = require('bcrypt');
    const MongoClient = require('mongodb@3.1.4').MongoClient;
    const client = new MongoClient('mongodb://jimmy-nomad:bettercallmecraig@nomadsland.ss6yb.mongodb.net/nomadsland?retryWrites=true&w=majority');

    client.connect(function (err) {
        if (err) return callback(err);

        const db = client.db('nomadsland');
        const users = db.collection('users');

        users.findOne({ email: user.email }, function (err, withSameMail) {
            if (err || withSameMail) {
                client.close();
                return callback(err || new Error('the user already exists'));
            }

            bcrypt.hash(user.password, 10, function (err, hash) {
                if (err) {
                    client.close();
                    return callback(err);
                }

                user.password = hash;
                users.insert(user, function (err, inserted) {
                    client.close();

                    if (err) return callback(err);
                    callback(null);
                });
            });
        });
    });
}

function verify(email, callback) {
    const MongoClient = require('mongodb@3.1.4').MongoClient;
    const client = new MongoClient('mongodb://jimmy-nomad:bettercallmecraig@nomadsland.ss6yb.mongodb.net/nomadsland?retryWrites=true&w=majority');

    client.connect(function (err) {
        if (err) return callback(err);

        const db = client.db('nomadsland');
        const users = db.collection('users');
        const query = { email: email, email_verified: false };

        users.update(query, { $set: { email_verified: true } }, function (err, count) {
            client.close();

            if (err) return callback(err);
            callback(null, count > 0);
        });
    });
}

function changePassword(email, newPassword, callback) {
    const bcrypt = require('bcrypt');
    const MongoClient = require('mongodb@3.1.4').MongoClient;
    const client = new MongoClient('mongodb://jimmy-nomad:bettercallmecraig@nomadsland.ss6yb.mongodb.net/nomadsland?retryWrites=true&w=majority');

    client.connect(function (err) {
        if (err) return callback(err);

        const db = client.db('nomadsland');
        const users = db.collection('users');

        bcrypt.hash(newPassword, 10, function (err, hash) {
            if (err) {
                client.close();
                return callback(err);
            }

            users.update({ email: email }, { $set: { password: hash } }, function (err, count) {
                client.close();
                if (err) return callback(err);
                callback(null, count > 0);
            });
        });
    });
}

function getByEmail(email, callback) {
    const MongoClient = require('mongodb@3.1.4').MongoClient;
    const client = new MongoClient('mongodb+srv://jimmy-nomad:bettercallmecraig@nomadsland.ss6yb.mongodb.net/nomadsland?retryWrites=true&w=majority');

    client.connect(function (err) {
        if (err) return callback(err);

        const db = client.db('nomadsland');
        const users = db.collection('users');

        users.findOne({ email: email }, function (err, user) {
            client.close();

            if (err) return callback(err);
            if (!user) return callback(null, null);

            return callback(null, {
                user_id: user._id.toString(),
                nickname: user.nickname,
                email: user.email
            });
        });
    });
}

function remove(id, callback) {
    const MongoClient = require('mongodb@3.1.4').MongoClient;
    const client = new MongoClient('mongodb://jimmy-nomad:bettercallmecraig@nomadsland.ss6yb.mongodb.net/nomadsland?retryWrites=true&w=majority');

    client.connect(function (err) {
        if (err) return callback(err);

        const db = client.db('nomadsland');
        const users = db.collection('users');

        users.remove({ _id: id }, function (err) {
            client.close();

            if (err) return callback(err);
            callback(null);
        });
    });

}

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
    if (req.cookies.access) {
        res.redirect('login');
    } else {
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
    const { username, psw, phone } = req.body;
    res.send(username + " : " + psw)
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

app.post('/callback', (req, res) => {
    res.redirect('welcome');
})

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

