const mongoose = require('mongoose');  
const Schema= mongoose.Schema;
const Review=require('./review')
const User= require('./user');

const opts = { toJSON: { virtuals: true } };

const campgroundschema = new Schema({
    title:String,
    price: Number,
    description: String,
    location: String,
    image:[
        {
            url:String,
            filename: String,
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
    
},opts);

campgroundschema.virtual('properties.popup').get(function(){
    return `<a href='/campground/${this._id}'><h6>${this.title}</h6></a><p>${this.location}</p>`
})

campgroundschema.post('findOneAndDelete', async(data)=>{
    if(data){
        await Review.deleteMany({_id:{$in:data.reviews}});
}})


module.exports = mongoose.model('Campground', campgroundschema);

