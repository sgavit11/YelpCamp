var express = require("express"),
	Campground = require("../models/campground"),
	Comment = require("../models/comment"),
	middleware = require("../middleware"),
	router = express.Router();

//Index- show all campgrounds
router.get("/", function (req, res){
	Campground.find({}, function(err, allCampgrounds){
		if (err){
			console.log (err);
		}
		else {
			res.render ("campgrounds/index", {campgrounds:allCampgrounds});

		}
	})
});

//create new campgrund in db
router.post ("/",middleware.isLoggedIn, function (req, res){
	var name = req.body.name,
		image = req.body.image,
		description = req.body.description,
		price = req.body.price,
		author = {
		id: req.user._id,
		username: req.user.username
	};
	
	var newCampground = {name:name, image:image, description:description, price:price, author:author};
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect ("/campgrounds");
		}
	});
});

//Show form to create new campground
router.get ("/new",middleware.isLoggedIn, function (req, res){
	res.render ("campgrounds/new");
});


//SHOW - shows more info about one campground
router.get("/:id", function (req, res){
	Campground.findById (req.params.id).populate("comments").exec(function (err, foundCampground){
		if (err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect ("back");

		} else {
			console.log(foundCampground)
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
})

//EDIT campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
	})
})

//Update campground route
router.put ("/:id",middleware.checkCampgroundOwnership, function (req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err){
			res.redirect("/campgrounds");
		} else {
			res.redirect ("/campgrounds/"+ req.params.id);
		}
		})
})

//Destroy campground
router.delete ("/:id",middleware.checkCampgroundOwnership, function (req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds")
		}
	})
})


module.exports = router;