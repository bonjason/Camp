var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allCamp){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCamp});
		}
	});
	
});

router.post("/campgrounds", isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};
	Campground.create(newCampground, function(err, newCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});

router.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			console.log(foundCamp);
			res.render("campgrounds/show", {campground: foundCamp});
		}
	});
	
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect("/login");
	}
}

module.exports = router;