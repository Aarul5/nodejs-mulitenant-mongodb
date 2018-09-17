var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport = require('passport');

//Testing 
passport.use(new GoogleStrategy({
    clientID: 's',
    clientSecret: 's',
    callbackURL: "s"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        console.log(accessToken);
        console.log(refreshToken);
        //  cb();
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     console.log()
        //     return cb(err, user);
        // });
    }
));  
