if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    
}

const express= require('express');
const mongoose= require('mongoose');
const path= require('path');
const method= require('method-override');
const engine= require('ejs-mate');
const AppError= require('./utilities/errormanagement.js');
const campgroundroutes = require('./routes/campground')
const reviewroutes = require('./routes/reviews')
const session=require('express-session');
const flash = require('connect-flash');
const app= express();
const passport= require('passport');
const LocalStrategy= require('passport-local');
const User= require('./model/user')
const userroutes=require('./routes/user');
const { required } = require('joi');
const { resolve6 } = require('dns');
const mongoSanitize = require('express-mongo-sanitize');
const MongoDbStore = require('connect-mongo');

const dburl=process.env.DB_URL
const secret=process.env.SECRET
//connecting to server
// "mongodb://localhost:27017/campground"
mongoose.connect(dburl)

//connection testing
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//server aspect

app.engine('ejs',engine);
app.use(method("_method"))
app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize({
    replaceWith: '_'
}))

const store=  MongoDbStore.create({
    mongoUrl: dburl,
    touchAfter: 24*60*60
})


app.use(session({
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.user)
    res.locals.User=req.user
    res.locals.fail=req.flash('error')
    res.locals.success=req.flash('Success')
    next();
})

app.use('/',userroutes)
app.use('/campground',campgroundroutes)
app.use('/campground/:id/review',reviewroutes); 


app.get('/', (req, res) => {
    res.render('content/home');
})

app.all('*',(req, res,next) => {
    const e=new AppError("Invalid Page",304)
    next(e);
})

app.use((err,req,res, next) => {
    console.log(err);
    const {StatusCode=404}=err;
    if(!err.message)error.message='content not found'
    res.status(StatusCode).render('content/error',{error:err})
})
const port=process.env.PORT
app.listen(port,()=>{
    console.log("Listening on port");
})