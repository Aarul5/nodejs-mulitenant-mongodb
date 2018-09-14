var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport = require('passport');

passport.use(new GoogleStrategy({
    clientID: '728768458083-d8rncq93hepgopc00dlvo4ds601uda43.apps.googleusercontent.com',
    clientSecret: 'EFeKJf0RtZkSDhC0_jxC9ZRL',
    callbackURL: "http://localhost:8085/login/google/redirect"
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