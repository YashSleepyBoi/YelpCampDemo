module.exports.isLoggedIn = function(req, res, next) {
    
    if(!req.isAuthenticated()){
        req.session.currurl=req.originalUrl;
        req.flash('error', 'You must be logged in to view this page.');
        return res.redirect('/login')
    }
    next();
}