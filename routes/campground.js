const express= require('express');
const router=express.Router();
const AppError= require('../utilities/errormanagement.js');
const {isLoggedIn}=require('../middleware')
const Campground=require("../model/index.js")
const campgrounds=require('../controller/campground')
const {campgroundschema}=require('../scheme');
const{storage}=require('../cloudinary/index')
const multer=require('multer')
const upload=multer({storage})




const CatchAsync= fn => {
    return (req,res, next) => {
        fn(req, res, next).catch(e=>next(e));
    }
}

const isAuthor=async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission to access this');
        return res.redirect('/campground')
    }
    next();
}


const Validator= (req,res,next) => {
    console.log(req.body)
    const {error}= campgroundschema.validate(req.body);
    if(error) throw new AppError(`${error.details[0].message}`,400)
    else{ next()};
}

router.get("/", CatchAsync(campgrounds.home))

router.route('/new')
    .get(isLoggedIn, campgrounds.newpage)
    .post( isLoggedIn,upload.array('image'),Validator,CatchAsync( campgrounds.new))

router.route('/:id')
    .get( isLoggedIn,CatchAsync(campgrounds.viewpage))
    .patch( isLoggedIn, isAuthor, upload.array('image'),Validator, CatchAsync(campgrounds.edit))
    .delete(isLoggedIn,campgrounds.delete )

router.route("/:id/edit")
    .get(isLoggedIn , isAuthor,campgrounds.editpage)
    .post(isLoggedIn,isAuthor,campgrounds.editimg)

module.exports = router;