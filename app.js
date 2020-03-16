const express = require('express');
const app = express();
const fetch = require('node-fetch');
const morgan = require('morgan');
const path = require('path');
const api = require('genius-api');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const FileStore = require('session-file-store')(session);
const mongoose = require('mongoose');
const User = require('./model/userModel');
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
salt = bcrypt.genSaltSync(10);


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan("dev"));

app.use(session({
    secret: 'cookies',
    key: "user_sid",
    store: new FileStore({}),
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));


mongoose.connect("mongodb://localhost:27017/login", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const indexRouter = require("./routes/index");
app.use('/', indexRouter);


const genius = new api(process.env.GENIUS_CLIENT_ACCESS_TOKEN);


const accessToken = "?access_token=eP5AYez2d-r79iLyygvDUD5yJnVqw3yjlIajluGonMeNxP6OYuIG6YwuoJg2SuC8";
const APISong = "https://api.genius.com/songs/";




app.get('/', async (req, res) => {
    const {songID} = req.query;
    const genius1 = require("genius-lyrics");
    const Genius2 = new genius1.Client(accessToken);

    if (!songID) {
        const maxSong = 247196;
        const songID = Math.floor(Math.random() * maxSong) + 1;
        const json = await (await fetch(APISong + songID + accessToken)).json();
        const img = json.response.song.song_art_image_url;
        const title = json.response.song.title;
        const release = json.response.song.release_date;
        const artist = json.response.song.primary_artist.name;
        const url = json.response.song.url;


        const lyricsJSON = await Genius2.getLyrics(url);
        let lyrics = lyricsJSON.lyrics;
        lyrics = lyrics.split('\n');

        app.locals.lyrics = lyrics;

        res.render('index', {
            img,
            title,
            release,
            artist,
            url

        });

    } else {
        const json = await (await fetch(APISong + songID + accessToken)).json();
        if (json.meta.status === 404) {
            return res.status(404).end();
        }
        const url = json.response.song.url;
        const lyricsJSON = await Genius2.getLyrics(url);
        let lyrics = lyricsJSON.lyrics;
        lyrics = lyrics.split('\n');
        const obj = {json, lyrics};

        res.json(obj);
    }
});


app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/registration', (req, res) => {
    res.render('registration')
});


app.get('/account', async (req, res) => {
    if (req.session.user) {
        let user = await User.findById({_id: req.session.user});
        res.render("account", {
            isLoggedIn: !!req.session.user,
            user
        });
    } else {
        res.redirect("/registration");
    }
});


app.post('/registration', async (req, res) => {
    const user = await User.findOne({email: `${req.body.email}`});
    if (user) {
        await res.render('registration')
    } else {
        const newUser = await new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        });
        await newUser.save();
        req.session.user = newUser._id;
        console.log(newUser);
        res.redirect('/account');
    }
});




app.post('/login', async (req, res) => {
    const user = await User.findOne({email: `${req.body.email}`});
    console.log(user);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        req.session.user = user._id;
        res.redirect('/account')
    } else {
        res.redirect('/registration')
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

app.get('/ownRandomizer', async(req, res) => {
    if (req.session.user) {
        let user = await User.findById({_id: req.session.user});
        res.render("index", {
            isLoggedIn: !!req.session.user,
            user
        });
    }
});





module.exports = app;
