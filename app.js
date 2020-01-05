var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Clothes  = require("./models/clothes"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");


// requiring routes
var commentRoutes    = require("./routes/comments"),
    clothesRoutes = require("./routes/clothes"),
    indexRoutes      = require("./routes/index");

// mongoose.connect("mongodb://localhost/camp", {
mongoose.connect("mongodb+srv://Yarden:yelpcamp@cluster0-7k43z.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "HELLO!",
    resave: false,
    saveUninitialized: false
}));

// app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/clothes", clothesRoutes);
app.use("/clothes/:id/comments", commentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The FASH Server Has Started!`);
});