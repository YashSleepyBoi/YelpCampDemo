
const Review=require('../model/review');
const Campground=require("../model/index.js")

module.exports.delete=async(req, res) => {
    const{id,reviewId} = req.params
    const review= await Review.findByIdAndDelete(reviewId);
    const campground = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    console.log(review);
    res.redirect(`/campground/${id}`)
}

module.exports.create=async(req, res) => {
    console.log(req.params)
    
    const id=req.params.id.trim()
    console.log(id)
    const campground = await Campground.findById(id);
    console.log(campground);
    const newReview = new Review(req.body);
    newReview.author=req.user._id
    campground.reviews.push(newReview);
    
    if(campground&&newReview){
        req.flash("Success","Successfully added review")
    }else{
        throw new AppError("Failed to create add review",200);
    }

    await newReview.save();
    await campground.save();
    res.redirect(`/campground/${id}`)
}