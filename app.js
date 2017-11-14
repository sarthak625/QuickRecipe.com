var express    = require('express');
var request    = require('request');
var bodyParser = require('body-parser');
var app        = express();
var path       = require('path');
var Tags       = require('./models/tags');
var mongoose   = require('mongoose');
var seedData   = require('./seeds/index');

//Connect to mongodb
mongoose.connect('mongodb://localhost/quickrecipe',{
  useMongoClient: true
});

seedData.addDefaultTags();

var api_key = 'bf0ea69d36a82e81cdd7ff3537e67913';

var page = 1;

//Set the view engine
app.set('view engine','ejs');

//The express and static paths are in the public directory
app.use(express.static(path.join(__dirname,'public')));

//Configure to use body parser
app.use(bodyParser.urlencoded({extended: true}));

//Home url
app.get('/',function(req,res){
  res.render('landing');
});

//The search url
app.get('/search',function(req,res){
  Tags.find({}, { _id: 0, tag: 1 }, function(err, foundTags){
          /* istanbul ignore next */
          if(err){ console.log(err); }
          var tags = [];
          // Retrieve tag from every tag
          foundTags.forEach(function (tag) {
              tags.push(tag.tag);
          });
          res.render('index',{tags: tags});
      });
})

//On submiting a search query
app.post('/search',function(req,res){
  var search = req.body.search;

  var url = "http://food2fork.com/api/search?key=" + api_key + "&page=" + page + "&q=" + search + "&sort=r";

  console.log(url);

  request(url,function(error,response,body){
    var data = JSON.parse(body);
    if (!(data.error) && !error && response.statusCode == 200) {
            data = data.recipes;
            if(data.length !== 0){
                   // this array is not empty
                 res.render("found", {data:data, q:search});
            }
            else {
                // this array is empty
                 res.render("not_found", {q:search});
            }

        } else {

            console.log("Something whent wrong!");
            console.log(error);
            res.redirect("/");
        }
    });
})

app.listen(process.env.PORT || 3000,function(){
  console.log("Running on port 3000");
})
