
// Render home page
module.exports.renderHomePage = (req, res) => {
    res.render('home', { 
        activePage: 'home',
        errorMessage: null
    });
}

// Render about page
module.exports.renderAboutPage = (req, res) => {
    res.render('about', { 
        activePage: 'about',
        errorMessage: null 
    });
}

// Render contact page
module.exports.renderContactPage = (req, res) => {
    res.render('contact', { 
        activePage: 'contact',
        errorMessage: null
    });
}

