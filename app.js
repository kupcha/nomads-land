const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser'); 
const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render('home');
});

function validateCookies(req, res, next) {
    const { cookies } = req;
    if (cookies.access == 'Y'){
        console.log('hell yeah');
        next();
    }
    else{
        res.status(403).send({msg: 'wrong'});
    }


}

app.post('/', (req, res) => {
    const { psw } = req.body;
    if (psw == 'bettercallmecraig') {
        res.cookie('access', 'Y', { maxAge: 900000, httpOnly: true });
        res.render('login');
    } else {
        res.render('home');
    }
});

app.post('/login', (req, res) => {
    const {username , psw } = req.body;
    res.send(`${username} : ${psw}`);
})


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log("sup craig");
});

