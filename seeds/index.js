var mongoose = require("mongoose");
var Tags     = require('../models/tags');

var seedDB = {};

var defaultTags = ['Apples','Baking powder','Bananas','Berries','Black pepper','Bread crumbs','Breakfasts'];

seedDB.addDefaultTags = function() {
    Tags.find({}, function(err, foundTags) {
        if(err){
          console.log(err) 
        }
        if (!(foundTags.length > 0)) {
            defaultTags.forEach(function(tag){
                Tags.create({tag: tag}, function(err, createdTag){
                    if(err){ console.log(err) }
                    console.log(createdTag);
                });
            });
        }

    });
};

module.exports = seedDB;
