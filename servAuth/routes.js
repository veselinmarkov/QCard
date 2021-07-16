
module.exports = function(app, passport) {

    
    // =====================================
    // LOGIN ===============================
    // =====================================
        // process the login form
    app.post('/login', passport.authenticate('local-login'), (req, res) => {
        res.json(req.user);
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup'), (req, res) => {
        //console.log(JSON.stringify(req.body));
        res.json(req.user);
    });

    
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.send('OK');
    });
};


