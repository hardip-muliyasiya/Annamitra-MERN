
// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

// Middleware to check if user is an admin
module.exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return res.redirect('/');
    }
    next();
}

// Middleware to check if user is a donor
module.exports.isDonor = (req, res, next) => {
    if (!req.user || req.user.role !== 'Donor') {
        return res.redirect('/');
    }
    next();
}

// Middleware to check if user is an NGO
module.exports.isNGO = (req, res, next) => {
    if (!req.user || req.user.role !== 'NGO') {
        return res.redirect('/');
    }
    next();
}

// Middleware to check if user is a volunteer
module.exports.isVolunteer = (req, res, next) => {
    if (!req.user || req.user.role !== 'Volunteer') {
        return res.redirect('/');
    }
    next();
}
