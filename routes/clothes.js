var express = require("express");
var router  = express.Router();
var Clothes = require("../models/clothes");
var middleware = require("../middleware");

// INDEX - show all clothes
router.get("/", function(req, res){
    // Get all clothes from DB
    Clothes.find({}, function(err, allClothes){
        if (err) {
            console.log(err);
        } else {
            res.render("clothes/index",{clothes: allClothes});
        }
    });
});

// CREATE - add new item to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to clothes array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newClothes = {name: name, image: image, description: desc, author:author};
    // Create a new item and save to DB
    Clothes.create(newClothes, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            //redirect back to clothes page
            console.log(newlyCreated);
            res.redirect("/clothes");
        }
    });
});

// NEW - show form to create new item
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("clothes/new");
});

// SHOW - shows more info about one item
router.get("/:id", function(req, res){
    // find the item with provided ID
    Clothes.findById(req.params.id).populate("comments").exec(function(err, foundItem){
        if (err) {
            console.log(err);
        } else {
            console.log(foundItem);
            // render show template with that item
            res.render("clothes/show", {item: foundItem});
        }
    });
});

// edit //
router.get("/:id/edit", middleware.checkItemOwnership, function(req, res){
    // does user own item?
    Clothes.findById(req.params.id, function(err, foundItem){
        // send also item ID
        res.render("clothes/edit", {item: foundItem})
    });
});

// update //
router.put("/:id", middleware.checkItemOwnership, function(req, res){
    Clothes.findByIdAndUpdate(req.params.id, req.body.item, function (err, updatedCampground){
        if (err) {
            res.redirect("/clothes");
        } else {
            res.redirect("/clothes/" + req.params.id);
        }
    });
});

// destroy //
router.delete("/:id", middleware.checkItemOwnership, function(req, res){
    Clothes.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect('/clothes');
        } else {
            res.redirect("/clothes");
        }
    });
});


module.exports = router;