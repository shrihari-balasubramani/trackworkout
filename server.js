// server.js
// where your node app starts

// init project
var express = require('express');
var app = express(),
    db = require('./db'),
	  UserIDMappingSchema = require('./UserIDMappingSchema'),
    TrackerMappingSchema = require('./TrackerMappingSchema'),
    path = require('path');
var bodyParser = require('body-parser');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.set('view engine', 'hbs');

app.post('/exercise/new-user',function(req,res, next){
  console.log(req,req.body)
    if(!req.body.user){
      res.send('no username specified');
    }else{
      UserIDMappingSchema.findOne({userName:req.body.user}, function(err,mappingObj) {
       if(err){
       res.send('Something went wrong our side');
      }else if(mappingObj){
          res.send('User name already taken');
        }else{
            var userMappingJson = {userName:req.body.user},
            userMappingSchema = new UserIDMappingSchema(userMappingJson);
            userMappingSchema.save();          
            res.send('Username is inserted');
        }  
      })
    }
  });
app.post('/exercise/add',function(req,res, next){
    if(!req.body.userName || !req.body.tDate || !req.body.desc || !req.body.duration || new Date(req.body.tDate) == 'Invalid Date'){
      res.send('required data missing/improper');
    }else{
      var trackerMappingJson = {userName: req.body.userName,tDate:new Date(req.body.tDate),desc:req.body.desc ,duration:req.body.duration},
      trackerMappingSchema = new TrackerMappingSchema(trackerMappingJson);
      trackerMappingSchema.save();          
      res.send('tracking data is inserted');
    }  
})
app.get('/exercise/log',function(req,res, next){
  console.log(req.query);
  if(!req.query.userName || req.query.limit && parseInt(req.query.limit) <0 || req.query.userName.match(/[^a-zA-Z1-90 ]/) ){
    res.send('improper data');
  }else{
      
      var queryObj = {userName:req.query.userName};

      if(req.query.from && new Date(req.query.from) != 'Invalid Date' ){
      	queryObj = {tDate :{$gte : new Date(req.query.from)}};
      }
      if(req.query.to && new Date(req.query.to) != 'Invalid Date'){
      	if(queryObj.tDate != undefined){
      		queryObj.tDate.$lte = new Date(req.query.to)
      	}else{
      		queryObj.tDate = {$lte : new Date(req.query.to)};
      	}
      }

      TrackerMappingSchema.find(queryObj)
      .limit(req.query.limit && parseInt(req.query.limit) || 100)
      .exec((err,data)=>{
      	if(err){
      		res.send('error fetching data');
      		return;
      	}
      	res.json(data);
      })
  }  
})
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
