var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
const User = require('../models/user');
const Review = require('../models/review');
const Trip = require('../models/trip');

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
      referrals: currentNomad.tips,
      userProfile: JSON.stringify(req.oidc.user, null, 2),
      title: 'nomadsland'
    })
  }else{
    const newUser = {
      email : `${userEmail}`,
      elevation : 0,
      trips : 0,
      tips : 0,
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

router.post('/profile', requiresAuth(), async function(req, res, next) {
  var userEmail = res.locals.user.email;
  var survey = req.body;
  var recsMade = survey.recsMade;
  var numberRecsMade = parseInt(recsMade);

  var activitySelection = survey.activitySelection;
  var activityDescription = survey.activityDescription;
  var activityLocation = survey.activityLocation;
  var activityRecsMade = survey.activityRecsMade;
  var foodRecsMade = survey.foodRecsMade;
  var sightRecsMade = survey.sightRecsMade;
  var activityList = new Array(activityRecsMade);
  if (activityRecsMade < 2 && activityRecsMade > 0){
    var currRec = { type: activitySelection, description: activityDescription, location: activityLocation};
    activityList[0] = currRec;
  }else{
    for (var i = 0; i < activityRecsMade && (activitySelection); i++){
      var currRec = { type: activitySelection[i], description: activityDescription[i], location: activityLocation[i], };
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
  var userTips = parseInt(currUser.tips);
  userTips += numberRecsMade;
  userTrips+=1;
  db.collection('users').findOneAndUpdate({email: userEmail}, { $set: {trips : userTrips, elevation: userElevation, tips: userTips}});
  await db.collection('reviews').insertOne(newSurvey);
  res.redirect('profile');
})

router.get('/test', requiresAuth(), async function(req, res, next){
  const userEmail = res.locals.user.email;
  const currentNomad = await User.findOne({email: userEmail});
  if (currentNomad){
    res.render('test', {
      username: currentNomad.username,
      elevation: currentNomad.elevation,
      trips: currentNomad.trips,
      referrals: currentNomad.tips,
      userProfile: JSON.stringify(req.oidc.user, null, 2),
      title: 'nomadsland'
    })
  }else{
    const newUser = {
      email : `${userEmail}`,
      elevation : 0,
      trips : 0,
      tips : 0,
      shownAboutScreen : 0
    }
    db.collection('users').insertOne(newUser);
    res.redirect('test');
  }
});

router.post('/testSurvey', requiresAuth(), function(req, res, next){
  const answer = req.body;
  const destination = answer.location;
  const lat = answer.lat;
  const long = answer.long;
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
  res.render('testSurvey',{
    userEmail : userEmail,
    location : destination,
    tripLat : lat,
    tripLong : long
  });
});

router.post('/testPreview', requiresAuth(), async function(req, res, next){
    /* user information = email linked to every review */
    var userEmail = res.locals.user.email;
    var survey = req.body;
  
    var recsMade = survey.recsMade;
    var numberRecsMade = parseInt(recsMade);
    var activityRecsMade = parseInt(survey.activityRecsMade);
    var foodRecsMade = parseInt(survey.foodRecsMade);
    var sightRecsMade = parseInt(survey.sightRecsMade);
    var tripLat = survey.tripLat;
    var tripLong = survey.tripLong;
    var tripLocation = survey.location;
  
    var activities = survey.activity;
    let activityLocation = survey.activityLocation;
    let activityExperience = survey.activityExperience;
    let activityCost = survey.activityCost;
    
    // let activityTags = new Array(activityRecsMade);
    // if (activityRecsMade > 1){
    //   for (var i = 0; i < activityRecsMade; i++){
    //     activityTags[i] = survey.activityTags[i];
    //   }
    // }else if (activityRecsMade == 1){
    //   activityTags[0] = survey.activityTags;
    // }
  
  
    let activityDescription = survey.activityDescription;
    let activityLat = survey.activityLat;
    let activityLong = survey.activityLong;
  
    let activityRecs = new Array(activityRecsMade);
    if (activityRecsMade == 1){
      var tempActivityRec = {
        activity : activities,
        activityLocation : activityLocation,
        activityExperience : activityExperience,
        activityCost : activityCost,
        // activityTags : activityTags,
        activityComments : activityDescription,
        activityLat : activityLat,
        activityLong : activityLong
      }
      activityRecs[0] = tempActivityRec;
    }else if (activityRecsMade > 1){
      for (var i = 0; i < activityRecsMade; i++){
        var tempActivityRec = {
          activity : activities[i],
          activityLocation : activityLocation[i],
          activityExperience : activityExperience[i],
          activityCost : activityCost[i],
          // activityTags : activityTags[i],
          activityComments : activityDescription[i],
          activityLat : activityLat[i],
          activityLong : activityLong[i]
        }
        activityRecs[i] = tempActivityRec;
      }
    }

  
    let foodLocation = survey.foodLocation;
    let cuisine = survey.cuisine;
    let foodExperience = survey.foodExperience;
    let foodCost = survey.foodCost;
    let foodComments = survey.foodComments;
    let foodLat = survey.foodLat;
    let foodLong = survey.foodLong;
  
    // let foodTags = new Array (foodRecsMade);
    // if (foodRecsMade > 1){
    //   for (var i = 0; i < foodRecsMade; i++){
    //     foodTags[i] = survey.foodTags[i];
    //   }
    // }else if (foodRecsMade == 1){
    //   foodTags[0] = survey.foodTags;
    // }
  
    let foodRecs = new Array(foodRecsMade);
    if (foodRecsMade > 1){
      for (var i = 0; i < foodRecsMade; i++){
        var tempFoodRec = {
          foodLocation : foodLocation[i],
          cuisine : cuisine[i],
          foodExperience : foodExperience[i],
          foodCost : foodCost[i],
          foodComments : foodComments[i],
          foodLat : foodLat[i],
          foodLong : foodLong[i],
          // foodTags : foodTags[i]
        }
        foodRecs[i] = tempFoodRec;
      }
    }else if (foodRecsMade == 1){
      var tempFoodRec = {
        foodLocation : foodLocation,
        cuisine : cuisine,
        foodExperience : foodExperience,
        foodCost : foodCost,
        foodComments : foodComments,
        foodLat : foodLat,
        foodLong : foodLong,
        // foodTags : foodTags
      }
      foodRecs[0] = tempFoodRec;
    }
    let sightLocation = survey.sightLocation;
    let sightExperience = survey.sightExperience;
    let sightCost = survey.sightCost;
    let sightDescription = survey.sightDescription;
    let sightLat = survey.sightLat;
    let sightLong = survey.sightLong;
  
    // let sightTags = new Array(sightRecsMade);
    // if (sightRecsMade > 1){
    //   for (var i = 0; i < sightRecsMade; i++){
    //     sightTags[i] = survey.sightTags[i];
    //   }
    // }else if (sightRecsMade == 1){
    //   sightTags[0] = survey.sightTags;
    // }
  
    let sightRecs = new Array(sightRecsMade);
    if (sightRecsMade > 1){
      for (var i = 0; i < sightRecsMade; i++){
        let tempSightRec = {
          sightLocation : sightLocation[i],
          sightExperience : sightExperience[i],
          sightCost : sightCost[i],
          sightComments : sightDescription[i],
          sightLat : sightLat[i],
          sightLong : sightLong[i]
        }
        sightRecs[i] = tempSightRec;
      }
    }else if (sightRecsMade == 1){
      let tempSightRec = {
        sightLocation : sightLocation,
        sightExperience : sightExperience,
        sightCost : sightCost,
        sightComments : sightDescription,
        sightLat : sightLat,
        sightLong : sightLong
      }
      sightRecs[0] = tempSightRec;
    }

  
    var newSurvey = {
      email : userEmail,
      location : tripLocation,
      tripLatitude : tripLat,
      tripLongitude : tripLong,
      recsMade : numberRecsMade,
      activityRecsMade : activityRecsMade,
      foodRecsMade : foodRecsMade,
      sightRecsMade : sightRecsMade,
      activityRecs : activityRecs,
      foodRecs : foodRecs,
      sightRecs : sightRecs
    };
    await db.collection('trips').insertOne(newSurvey);
  res.send(req.body);
});

router.post('/testPreview', requiresAuth(), async function(req, res, next){
  /* user information = email linked to every review */
  var userEmail = res.locals.user.email;
  var survey = req.body;

  var recsMade = survey.recsMade;
  var numberRecsMade = parseInt(recsMade);
  var activityRecsMade = parseInt(survey.activityRecsMade);
  var foodRecsMade = parseInt(survey.foodRecsMade);
  var sightRecsMade = parseInt(survey.sightRecsMade);
  var tripLat = survey.tripLat;
  var tripLong = survey.tripLong;
  var tripLocation = survey.location;

  var activities = survey.activty;
  let activityLocations = survey.activityLocations;
  let activityExperience = survey.activityExperience;
  let activityCost = survey.activityCost;
  
  let activityTags = new Array(activityRecsMade);
  if (activityRecsMade > 1){
    for (var i = 0; i < activityRecsMade; i++){
      activityTags[i] = survey.activityTags[i];
    }
  }else{
    activityTags[0] = survey.activityTags;
  }


  let activityDescription = survey.activityDescription;
  let activityLat = survey.activityLat;
  let activityLong = survey.activityLong;

  let activityRecs = new Array(activityRecsMade);
  for (var i = 0; i < activityRecsMade; i++){
    var tempActivityRec = {
      activity : activities[i],
      activityLocation : activityLocations[i],
      activityExperience : activityExperience[i],
      activityCost : activityCost,
      activityTags : activityTags[i],
      activityComments : activityDescription[i],
      activityLat : activityLat[i],
      activityLong : activityLong[i]
    }
    activityRecs[i] = tempActivityRec;
  }

  let foodLocation = survey.foodLocation;
  let cuisine = survey.cuisine;
  let foodExperience = survey.foodExperience;
  let foodCost = survey.foodCost;
  let foodComments = survey.foodComments;
  let foodLat = survey.foodLat;
  let foodLong = survey.foodLong;

  let foodTags = new Array (foodRecsMade);
  if (foodRecsMade > 1){
    for (var i = 0; i < foodRecsMade; i++){
      foodTags[i] = survey.foodTags[i];
    }
  }else{
    foodTags[0] = survey.foodTags;
  }

  let foodRecs = new Array(foodRecsMade);
  for (var i = 0; i < foodRecsMade; i++){
    var tempFoodRec = {
      foodLocation : foodLocation[i],
      cuisine : cuisine[i],
      foodExperience : foodExperience[i],
      foodCost : foodCost[i],
      foodComments : foodComments[i],
      foodLat : foodLat[i],
      foodLong : foodLong[i],
      foodTags : foodTags[i]
    }
    foodRecs[i] = tempFoodRec;
  }


  let sightLocation = survey.sightLocation;
  let sightExperience = survey.sightExperience;
  let sightCost = survey.sightCost;
  let sightDescription = survey.sightDescription;
  let sightLat = survey.sightLat;
  let sightLong = survey.sightLong;

  let sightTags = new Array(sightRecsMade);
  if (sightRecsMade > 1){
    for (var i = 0; i < sightRecsMade; i++){
      sightTags[i] = survey.sightTags[i];
    }
  }else{
    sightTags[0] = survey.sightTags;
  }

  let sightRecs = new Array(sightRecsMade);
  for (var i = 0; i < sightRecsMade; i++){
    let tempSightRec = {
      sightLocation : sightLocation[i],
      sightExperience : sightExperience[i],
      sightCost : sightCost[i],
      sightComments : sightDescription[i],
      sightLat : sightLat[i],
      sightLong : sightLong[i]
    }
    sightRecs[i] = tempSightRec;
  }





  var newSurvey = {
    email : userEmail,
    location : tripLocation,
    tripLatitude : tripLat,
    tripLongitude : tripLong,
    recsMade : recsMade,
    activityRecsMade : activityRecsMade,
    foodRecsMade : foodRecsMade,
    sightRecsMade : sightRecsMade,
    activityRecs : activityRecs,
    foodRecs : foodRecs,
    sightRecs : sightRecs
  };

  await db.collection('trips').insertOne(newSurvey);








  // var foodLat = survey.foodLat;
  // var foodLong = survey.foodLong;
  // var sightLong = survey.sightLong;
  // var sightLat = survey.sightLat;
  // var foodLocation = survey.foodLocation;
  // var sightLocation = survey.sightLocation;

  res.render('testPreview', {
    userEmail : userEmail,
    tripLocation : tripLocation,
    tripLat : tripLat,
    tripLong : tripLong,
    activityLats : activityLats,
    activityLong : activityLong,
    recsMade : numberRecsMade,
    foodRecsMade : foodRecsMade,
    sightRecsMade : sightRecsMade,
    activityRecsMade : activityRecsMade,
    activityLocation : activityLocation,
    foodLong : foodLong,
    foodLat : foodLat,
    sightLong : sightLong,
    sightLat : sightLat,
    foodLocation : foodLocation,
    sightLocation : sightLocation
  });

});


module.exports = router;