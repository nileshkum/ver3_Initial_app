const User = require('../Model/user');

exports.getLogin = (req, res, next) => {
    // const isAuthenticated = req.get('Cookie').split('=')[1];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isAuthenticated

    })

}

exports.postLogin = (req, res, next) => {
    User.findById('6412139ab6ace7bb4c682cfa')
        .then(user => {
            req.session.isAuthenticated = true;
            req.session.user = user;
            // res.setHeader('Set-Cookie', 'isAuthenticated=true');
            req.session.save(err => {
                // console.log(err);
                res.redirect('/');
            });

        })
        .catch(err => {
            console.log(err);
        });

}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}