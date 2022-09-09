const express=require('express');  
const router=express.Router({mergeParams: true});

const Review=require('../model/review');
const Campground=require("../model/index.js")

const AppError= require('../utilities/errormanagement.js');
const {reviewschema}=require('../scheme');
const {isLoggedIn}=require('../middleware')
const reviewcontroller=require('../controller/review')

const CatchAsync= fn => {
    return (req,res, next) => {
        fn(req, res, next).catch(e=>next(e));
    }
}

const Validator= (req,res,next) => {
    console.log(req.body)
    const {error}= reviewschema.validate(req.body);
    if(error) throw new AppError(`${error.details[0].message}`,400)
    else{ next()};
}

const isReviewAuthor=async(req,res,next) =>{
    const{id,reviewId} = req.params
    const review= await Review.findById(reviewId).populate('author');
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'Cannot delete review that is not urs')
        return res.redirect(`/campground/${id}`)
    }
    next()
}

router.delete("/:reviewId",isReviewAuthor,CatchAsync( reviewcontroller.delete))

router.post("/",Validator,isLoggedIn,CatchAsync(reviewcontroller.create ))

module.exports = router