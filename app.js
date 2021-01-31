const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render('home');
});

app.post('/accountLogin', (req, res) => {
    const { psw } = req.body;
    if (psw == 'bettercallmecraig') {
        res.cookie('betaAccess', 'Y', { maxAge: 900000, httpOnly: true });
        console.log('login cookie created');
        res.render('accountLogin');
    } else {
        res.render('home');
    }
});


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log("sup craig");
});

