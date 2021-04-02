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

router.get('/test', requiresAuth(), async function (req, res, next) {
  const userEmail = res.locals.user.email;
  const currentNomad = await User.findOne({email: userEmail});
  if (currentNomad){
    res.render('test', {
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
    res.redirect('test');
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


router.post('/thankyou', requiresAuth(), async function(req, res, next) {
  var userEmail = res.locals.user.email;
  var survey = req.body;
  var recsMade = survey.recsMade;

  var activitySelection = survey.activitySelection;
  var activityLocation = survey.activityLocation;
  var activityRecsMade = survey.activityRecsMade;
  var foodRecsMade = survey.foodRecsMade;
  var sightRecsMade = survey.sightRecsMade;
  var activityList = new Array(activityRecsMade);
  if (activityRecsMade < 2 && activityRecsMade > 0){
    var currRec = { type: activitySelection, location: activityLocation};
    activityList[0] = currRec;
  }else{
    for (var i = 0; i < activityRecsMade && (activitySelection); i++){
      var currRec = { type: activitySelection[i], location: activityLocation[i]};
       activityList[i] = currRec;
    }
  }
  var foodSelection = survey.foodSelection;
  var foodLocation = survey.foodLocation;
  var foodList = new Array(foodRecsMade);
  if (foodRecsMade < 2 && foodRecsMade > 0){
    var currRec = { type: foodSelection, location: foodLocation};
    foodList[0] = currRec;
  }else{
    for (var i = 0; i < foodRecsMade && (foodSelection); i++){
      var currRec = { type: foodSelection[i], location: foodLocation[i]};
      foodList[i] = currRec;
    }
  }
  var sightSelection = survey.sightSelection;
  var sightLocation = survey.sightLocation;
  var sightList = new Array(sightRecsMade);
  if (sightRecsMade < 2 && sightRecsMade > 0){
    var currRec = { type: sightSelection, location: sightLocation};
    foodList[0] = currRec;
  }else{
    for (var i = 0; i < sightRecsMade && (sightSelection); i++){
      var currRec = { type: sightSelection[i], location: sightLocation[i]};
      sightList[i] = currRec;
    }
  }
  var newSurvey = {
    email : userEmail,
    year : survey.yearOfVisit,
    location : survey.location,
    seasons : survey.seasons,
    fun : survey.fun,
    food : survey.food,
    sights : survey.sights,
    locals : survey.locals,
    price : survey.price,
    enviro : survey.enviro,
    activityRecs : activityList,
    foodRecs : foodList,
    sightRecs : sightList,
    mscEnviro : survey.mscEnviro
  };
  var currUser = await User.findOne({email: userEmail});
  var userElevation = currUser.elevation;
  userElevation = 10 + (10 * recsMade) + userElevation;
  var userTrips = currUser.trips;
  userTrips+=1;
  db.collection('users').findOneAndUpdate({email: userEmail}, { $set: {trips : userTrips, elevation: userElevation}});
  await db.collection('reviews').insertOne(newSurvey);
  res.send(req.body);
})

module.exports = router;