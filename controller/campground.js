const { request } = require("express");
const { required } = require("joi");
const Campground=require("../model/index.js")
const AppError= require('../utilities/errormanagement.js');
const {cloudinary}=require('../cloudinary/index')

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder= mbxGeocoding({
    accessToken:process.env.MAPBOX_KEY
})


module.exports.home= async(req, res) => {
    const allcampground = await Campground.find({});
    res.render("../views/content/campgrounds", {allcampground});
}

module.exports.newpage=async(req, res) => {
    res.render("../views/content/newcampground");
}

module.exports.new=async(req, res) => {
    
    const campground = new Campground(req.body);
    const GeoData=await geocoder.forwardGeocode({
        query:req.body.location,
        limit:1
    }).send()
    
    if(campground){
        req.flash("Success","Successfully created new campground")
    }else{
        throw new AppError("Failed to create new campground!",200);
    }
    campground.author=req.user._id;
    campground.image=req.files.map(f=>({url:f.path, filename:f.filename}))
    campground.geometry=GeoData.body.features[0].geometry
    
    
    console.log(campground)
    await campground.save();
    res.redirect("/campground")
}

module.exports.viewpage=async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if(!campground){
        throw new AppError("Page Not Found",404);
    }
    res.render("../views/content/campground", {campground});
}

module.exports.editpage=async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    console.log(req.params)
    res.render("../views/content/campgroundedit",{campground})
}

module.exports.edit=async(req, res) => {
    const campground_id = await Campground.findById(req.params.id);
    
    for(let i of req.files){
        const imgobj={
            url:i.path,
            filename:i.filename
        }
        console.log(imgobj)
        campground_id.image.push(imgobj)
        

    }
    campground_id.save()
    
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body)
    if(campground){
        req.flash("Success","Successfully editted campground")
    }else{
        throw new AppError("Failed to create edit campground!",200);
    }
    res.redirect("/campground")
}

module.exports.delete=async(req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campground")
}

module.exports.editimg=async(req, res) => {
    console.log(req.body)
    let imgfile=[]
    if(req.body.delete){
        for (let img of req.body.delete){
            imgfile.push(img.replace(/ /g,''))
        }

        // for (let filename of imgfile) {
        //     await cloudinary.uploader.destroy(filename);
        // }
        
        const campground = await Campground.findByIdAndUpdate(req.params.id,{$pull:{image:{filename:{$in:imgfile}}}})
        
        console.log(campground)
    }
    

    
    console.log('Redirecting')
    req.flash('success','Image Deleted Successfully')
    res.redirect(`/campground/${req.params.id}`)
    }