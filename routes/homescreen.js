var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://jimmy-nomad:bettercallmecraig@nomadsland.ss6yb.mongodb.net/nomadsland?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB instance.")
  })
  .catch(err => {
    console.log("Error connecting to MongoDB:")
    console.log(err)
  });
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to mongo');
});


router.get('/', function (req, res, next) {
  if (req.oidc.isAuthenticated()) {
    res.redirect('profile');
  } else {
    res.render('index');
  }
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'nomadsland'
  });
});

router.get('/callback', requiresAuth(), function (req, res, next) {
  res.redirect('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'nomadsland'
  });
});

module.exports = router;