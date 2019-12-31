var Campground = require("../models/campground");
var Comment = require("../models/comment");


// all the middleware //
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
        if (req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if (err) {
                    req.flash("error", "Campground not found");
                    res.redirect("back")
                } else {
                    // does user own campground
                    if(foundCampground.author.id.equals(req.user._id)){
                        next(); // send also campground ID
                    } else {
                        res.send("we dont have permission");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in");
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function (req, res , next) {
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err){
                res.redirect("back")
            } else {
                // does user own comment
                if(foundComment.author.id.equals(req.user._id)){
                    next(); // send also comment ID
                } else {
                    req.flash("error", "Please log in first!")
                    res.send("We dont have permission");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){

    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in first!")
    res.redirect("/login");
}

module.exports = middlewareObj