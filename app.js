const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log("sup craig");
});

app.get('/', (req, res) => {
    res.send("welcome craig");
});