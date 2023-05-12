const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
app.use(
    session({
        secret: "okoko",
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 24 * 10,
        },
    })
);
require('dotenv').config();

const google = require('passport-google-oauth2').Strategy;

passport.use(new google({
    clientID: process.env.googleClientID,
    clientSecret: process.env.googleClientSecret,
    callbackURL: process.env.callbackURL,
    passReqToCallback: true,
}, function (request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    return done(null, profile)
}
));

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {

    done(null, user)

})

app.use(passport.initialize());

app.use(passport.session());

app.set('view engine', 'ejs');

app.set('views', './views')

app.get('/home', (req, res) => {
    res.send('success')
})

app.get('/', async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error);
    }
});

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
    console.log(email);
});

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }), function (req, res) {
    res.redirect('/home');
});

app.listen(4444, () => {
    console.log("Server is Running");
})