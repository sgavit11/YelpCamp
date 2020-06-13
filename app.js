var express = require ("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	User = require("./models/user"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require ("./seeds");


//setup routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASPORT congif
app.use(require("express-session")({
	secret:"Zorro is from an alaskan malamute and siberian husky mix!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use( new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended: true}));
app.set ("view engine", "ejs");

app.use(function (req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash ("error");
	res.locals.success = req.flash("success");
	next();
})


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use ("/campgrounds/:id/comments", commentRoutes);

app.listen (3000,() => {
	console.log ("YelpCamp server is active on port 3000")
	});