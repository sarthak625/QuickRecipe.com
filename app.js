var express = require('express');
var request = require('request');
var app     = express();

var api_key = 'bf0ea69d36a82e81cdd7ff3537e67913';
var search  = 'shredded%20chicken';
var page = 1;

//Set the view engine
app.set('view engine','ejs');

var url = "http://food2fork.com/api/search?key=" + api_key + "&page=" + page + "&q=" + search + "&sort=r";

console.log(url);

app.get('/search',function(req,res){
  request(url,function(error,response,body){
    var data = JSON.parse(body);
    if (!(data.error) && !error && response.statusCode == 200) {
            data = data.recipes;
            // Tags.find({}, { _id: 0, tag: 1 }, function(err, foundTags){
            //     if(err){ console.log(err); }
            //     var tags = [];
            //     foundTags.forEach(function (tag) {
            //         tags.push(tag.tag);
            //     });
            //     /* istanbul ignore next */
                if(data.length !== 0){
                     // this array is not empty
                   res.render("found", {data:data, q:search, page:page});
                } else {
                    // this array is empty
                   res.render("no_result", {q:search});
                }
            // });

        } else {

            console.log("Something whent wrong!");
            console.log(error);
            res.redirect("back");
        }
    });
  });

app.get('/',function(req,res){
  res.render('index');
})

app.listen(3000,function(){
  console.log("Running on port 3000");
})
