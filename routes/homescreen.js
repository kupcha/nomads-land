var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
const User = require('../models/user');

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
    res.redirect('about');
  } else {
    res.render('welcome');
  }
});

router.get('/profile', requiresAuth(), async function (req, res, next) {
  const userEmail = res.locals.user.email;
  const currentNomad = await User.findOne({email: userEmail});
  res.render('profile', {
    username: currentNomad.username,
    elevation: currentNomad.elevation,
    trips: currentNomad.trips,
    referrals: currentNomad.referrals,
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'nomadsland'
  });

});


router.get('/about', function (req, res, next) {
  res.render('test')
});

router.get('/callback', requiresAuth(), function (req, res, next) {
  res.redirect('about', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'nomadsland'
  });
});


router.post('/survey', requiresAuth(), function (req, res, next) {
  res.redirect('survey', {
    destination: req.location
  })
})

module.exports = router;