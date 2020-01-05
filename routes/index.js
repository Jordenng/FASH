var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
request = require('request');

// root route
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/home", function(req, res){
    let apiKey = '88b3abdc1bf197e8f4fc205bc3d29633\n';
    let city = 'lod, il';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
            console.log('error:', error);
        } else {
            var weather = JSON.parse(body);
            var message = `${weather.main.temp}`;
            console.log(message);
            res.render("home", {message: message});
        }
    });
});
// show register form
router.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to FASH " + user.username);
            res.redirect("/clothes");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/clothes",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","log out");
    res.redirect("/clothes");
});



module.exports = router;