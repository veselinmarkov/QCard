// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt   = require('bcrypt-nodejs');

// expose this function to our app using module.exports
module.exports = function(passport, usersDB) {

    function findOne(id, cbfunc) {
        //console.log("Invoked findOne id: "+JSON.stringify(id));
        usersDB.get(id).then((data) => {
            //console.log("Found in DB:"+JSON.stringify(data));
            cbfunc(null, data)
        }).catch((err) => {
            if (String(err.message).indexOf('missing') > -1 || 
                    String(err.message).indexOf('deleted') > -1)
                cbfunc(null, null);
            else {
                console.log("Error in DB:"+JSON.stringify(err));
                cbfunc(err);
            }
        })    
    }

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        //console.log("Invoked serializer with argument user:"+ JSON.stringify(user));
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        //console.log("Invoked deserializer and should call User.findById Id:"+String(id));
        findOne(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'user',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        findOne(email, function(err, user) {
            // if there are any errors, return the error
            //if (String(err).indexOf('deleted') === -1)
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, {'signupMessage': 'That user is already taken.'});
            } else {
                let newUser = {
                    _id: email,
                    id: email,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null), //; User.generateHash(password),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                }
                // save the user
                usersDB.insert(newUser).then(() => {
                    let fixedUser = JSON.parse(JSON.stringify(newUser));
                    delete fixedUser.password;
                    return done(null, fixedUser);
                }).catch((err) => {
                    return done(err);
                });
            }

        });
        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'user',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        findOne(email, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, {'loginMessage': 'No user found.'});

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, user.password)) //(!User.validPassword(password, user))
                return done(null, false, {'loginMessage': 'Oops! Wrong password.'});

            // all is well, return successful user
            let newUser = JSON.parse(JSON.stringify(user));
            if (newUser.password)
                delete newUser.password;
            return done(null, newUser);
        });

    }));

};
