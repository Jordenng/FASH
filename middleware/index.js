var Campground = require("../models/clothes");
var Comment = require("../models/comment");

// all the middleware //
var middlewareObj = {};

middlewareObj.checkItemOwnership = function(req, res, next){
        if (req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundItem){
                if (err) {
                    req.flash("error", "Item not found");
                    res.redirect("back");
                } else {
                    // does user own item?
                    if(foundItem.author.id.equals(req.user._id)){
                        next(); // send also item ID
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in");
            res.redirect("back");
        }
};

middlewareObj.checkCommentOwnership = function(req, res , next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back");
            } else {
                // does user own comment
                if(foundComment.author.id.equals(req.user._id)){
                    next(); // send also comment ID
                } else {
                    req.flash("error", "Please log in first!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please log in first!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){

    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in first!");
    res.redirect("/login");
};

module.exports = middlewareObj;