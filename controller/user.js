const User=require('../model/user')

module.exports.registerpage=(req, res)=>{
    res.render('content/register.ejs')
}

module.exports.register=async(req, res,next)=>{
    try{
        console.log(req.body);
        const{email,username,password} = req.body;
        const user = new User({email, username});
        const registereduser=await User.register(user,password)
        console.log(registereduser);

        req.login(registereduser,(err)=>{
            
            if (err) return next(err);
            req.flash('success', 'Register Successfully')
            res.redirect('/campground')
        })
    }catch(err) {
        console.log(err)
        req.flash('error', err.message);
        res.redirect('/register')
    }
}

module.exports.loginpage= async(req, res) => {   
    res.render('content/login')
}

module.exports.login=(req, res) => {   
    req.flash('Success','Login Successful')
    const redirecturl=req.session.currurl || '/campground';
    delete req.session.currurl 
    console.log(redirecturl)
    res.redirect(redirecturl)
}

module.exports.logout=(req, res) => {
    req.logout(function(err){
        if (err) { return next(err); }})
    
    res.redirect('/login')
}