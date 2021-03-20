var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
const User = require('../models/user');
const Review = require('../models/review');

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


router.get('/', async function (req, res, next) {
  if (req.oidc.isAuthenticated()) {
    // const userEmail = res.locals.user.email;
    // const currentNomad = await User.findOne({email: userEmail});
    // if (currentNomad.shownAboutScreen == 0){
    //   User.findOneAndUpdate({email: userEmail}, {shownAboutScreen : 1});
    //   res.redirect('about');
    // }else{
    //   res.redirect('profile');
    // }
    res.redirect('profile');
  } else {
    res.render('welcome');
  }
});

router.get('/profile', requiresAuth(), async function (req, res, next) {
  const userEmail = res.locals.user.email;
  const currentNomad = await User.findOne({email: userEmail});
  if (currentNomad){
    res.render('profile', {
      username: currentNomad.username,
      elevation: currentNomad.elevation,
      trips: currentNomad.trips,
      referrals: currentNomad.referrals,
      userProfile: JSON.stringify(req.oidc.user, null, 2),
      title: 'nomadsland'
    })
  }else{
    const newUser = {
      email : `${userEmail}`,
      elevation : 0,
      trips : 0,
      referrals : 0,
      shownAboutScreen : 0
    }
    db.collection('users').insertOne(newUser);
    res.redirect('profile');
  }
});


router.get('/about', function (req, res, next) {
  res.render('about')
});


router.get('/callback', requiresAuth(), function (req, res, next) {
  res.redirect('about', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'nomadsland'
  });
});


router.post('/survey', requiresAuth(), async function (req, res, next) {
  const answer = req.body;
  const destination = answer.location;
  const userEmail = res.locals.user.email;
  // const foundReview = Review.findOne({email: userEmail, location : destination});
  // if (foundReview){
  //   res.send(foundReview);
  // }
  // else{
  //   const newReview = new Review({"email": userEmail, "location": destination});
  //   await newReview.save();
  //   res.render('survey', {
  //     location : `${destination}`,
  //     userEmail : userEmail
  //   })
  // }
  res.render('survey',{
    userEmail : userEmail,
    location : destination
  });
});

router.post('/survey/recommendations', requiresAuth(), async function(req, res, next) {
  const userEmail = res.locals.user.email;
  const survey = req.body;
  const activitySelection = req.body.activitySelection;
  const activiytLocation = req.body.activiytLocation;
  const activityList = new Array();
  for (var i = 0; i < activitySelection.length; i++){
    const temp = {key: activitySelection, value: activiytLocation};
    activityList[i] = temp;
  }
  const newSurvey = {
    email : userEmail,
    location : survey.location,
    seasons : survey.seasons,
    fun : survey.fun,
    food : survey.food,
    sights : survey.sights,
    locals : survey.locals,
    price : survey.price,
    enviro : survey.enviro
  };
  if (survey.mscEnviro){
    newSurvey.mscEnviro = survey.mscEnvir;
  }
  await db.collection('reviews').insertOne(newSurvey);
  res.render('recommendations');
  // res.send(JSON.stringify(req.body))
});


router.post('/thankyou', requiresAuth(), function(req, res, next) {
  // const userEmail = res.locals.user.email;
  // const survey = req.body;
  // const newSurvey = {
  //   email : userEmail,
  //   location : survey.location,
  //   seasons : survey.seasons,
  //   fun : survey.fun,
  //   food : survey.food,
  //   sights : survey.sights,
  //   locals : survey.locals,
  //   price : survey.price,
  //   enviro : survey.enviro
  // };
  // if (survey.mscEnviro){
  //   newSurvey.mscEnviro = survey.mscEnvir;
  // }
  // await db.collection('reviews').insertOne(newSurvey);
  // res.render('recommendations');
  const formData = req.body;
  const activitySelection = formData.activitySelection;
  const activiytLocation = formData.activiytLocation;
  const activityList = new Array();
  for (let i = 0; i < activitySelection.length; i++){
    //var map = new Map();
    //map.set(activitySelection[i], activiytLocation[i]);
    //activityList[i] = map;
  }
  res.send(formData);
})

module.exports = router;