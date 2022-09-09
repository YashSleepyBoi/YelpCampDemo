
const mongoose = require('mongoose');  
const Schema= mongoose.Schema
const User= require('./user');

const reviewschema= new Schema({
    rating:Number,
    review: {
        type:String,
        required:true,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

});

module.exports=mongoose.model('Review', reviewschema)