const express = require('express');
const app = express();

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname,'public')));


app.get('/', (req, res) => {
    res.render('home');
});


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log("sup craig");
});

