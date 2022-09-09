const express=require('express');  
const router=express.Router({mergeParams: true});
const User=require('../model/user')
const passport=require('passport');
const usercontroller=require('../controller/user')

router.route('/register')
    .get( usercontroller.registerpage )
    .post( usercontroller.register)


router.route('/login')
    .get(usercontroller.loginpage )
    .post(passport.authenticate('local', { failureFlash:true,failureRedirect: '/login', failureMessage: true }),usercontroller.login)

router.get('/logout',usercontroller.logout)

module.exports= router;