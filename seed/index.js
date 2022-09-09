const mongoose = require('mongoose');
const city = require('./city.js');
const{descriptors,places}=require("./seeds.js")
const Campground=require('../model/index.js');
// console.log(descriptors.length)

mongoose.connect("mongodb://localhost:27017/campground")

const db = mongoose.connection;
//Database connection check
db.on('error', (err) => {   console.error(err); }); 
db.on('open', () => {
    console.log('Connected to MongoDB');
})

function seedrand(array){
    random=Math.floor(Math.random() * (array.length))
    return array[random];
}
imglst=['https://source.unsplash.com/collection/8640809','https://source.unsplash.com/collection/mX8JvXKdKI','https://source.unsplash.com/collection/1273441','https://source.unsplash.com/collection/483251']
const seed= async() => {
    await Campground.deleteMany({})
    for(let i=0; i<200; i++) {
        const random=Math.floor(Math.random() * 1000);
        const randomprice=Math.floor(Math.random() *20);
        const newcamp=new Campground({
            location:`${city[random].city}, ${city[random].state}`,
        
            title: `${seedrand(descriptors)} ${seedrand(places)}`,
            image:[{
                url: 'https://res.cloudinary.com/dw5yiygar/image/upload/v1662526349/YelpCamp/kdaq8zugsieif1hwszlf.jpg',
                filename: 'YelpCamp/kdaq8zugsieif1hwszlf',
                
              },
              {
                url: 'https://res.cloudinary.com/dw5yiygar/image/upload/v1662526353/YelpCamp/oe6ptvpv99xb0w4whccx.jpg',
                filename: 'YelpCamp/oe6ptvpv99xb0w4whccx',
                
              }
          ],
          geometry: {
            type: "Point",
            coordinates: [
              city[random].longitude,
              city[random].latitude,
          ]
        },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price:randomprice,
            author:'631590e67c0f390778b90c77'
        })
        // console.log(newcamp)
        await newcamp.save();

    }
};

seed().then(()=>{
    db.close();
})