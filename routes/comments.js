var express = require("express");
var router  = express.Router({mergeParams: true});
var Clothes = require("../models/clothes");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find item by id
    console.log(req.params.id);
    Clothes.findById(req.params.id, function(err, item){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {item: item});
        }
    });
});

// Create
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup item using ID
    Clothes.findById(req.params.id, function(err, item){
        if (err) {
            console.log(err);
            res.redirect("/clothes");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    req.flash("error", "Something is wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    item.comments.push(comment);
                    item.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect('/clothes/' + item._id);
                }
            });
        }
    });
});

// edit //
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id,  function(err, foundComment){
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// update //
router.put("/:comment_id", middleware.checkCommentOwnership, function(req ,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/clothes/" + req.params.id);
       }
   });
});

// destroy comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if (err){
           res.redirect("back");
       } else {
           res.redirect("/clothes/" + req.params.id);
       }
   });
});



module.exports = router;