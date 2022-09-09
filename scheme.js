const Joi= require('joi');

module.exports.campgroundschema = Joi.object({
    title:Joi.string().required(),
    location:Joi.string().required(),
    description:Joi.string().required(),
    //image:Joi.string().required(),
    price:Joi.number().min(0).required(),
    
})


module.exports.reviewschema = Joi.object({
    rating: Joi.number().required(),
    review:Joi.string().required()
})

