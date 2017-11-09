var express    = require('express');
var request    = require('request');
var bodyParser = require('body-parser');
var app        = express();

var api_key = 'bf0ea69d36a82e81cdd7ff3537e67913';
var search  = 'shredded%20chicken';
var page = 1;

//Set the view engine
app.set('view engine','ejs');

//The express and static paths are in the public directory
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req,res){
  res.render('index');
})

app.post('/',function(req,res){
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
