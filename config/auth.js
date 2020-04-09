function ensureAuthenticated(req, res, next) {
    console.log("in ensureAuthenticated  >>>", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_message', 'Please log in to view that resource');
    res.redirect('/users/login');
}

function forwardAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
    return next();
    }
    res.redirect('/dashboard');
}

exports.ensureAuthenticated = ensureAuthenticated;
exports.forwardAuthenticated = forwardAuthenticated;