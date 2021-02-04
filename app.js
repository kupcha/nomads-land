const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
mongoose.connect('mongodb://localhost:27017/nomadsland', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("connected to mongodb")
})
.catch(err => {
    console.log("error connecting to mongodb")
    console.log(err)
});
const app = express();


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
        res.redirect('home');
    }
});

app.get('/', (req, res) => {
    if (req.cookies.access){
        res.redirect('login');
    }
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const {username , psw } = req.body;
    const user = await User.find({});
    console.log(user);
    res.send(user);
})



const port = process.env.port || 3001;
app.listen(port, () => {
    console.log("sup craig");
});

