const express   = require('express');
const session   = require('express-session');
const mongoose  = require('mongoose');
const Gun       = require('gun');
const passport  = require('passport');
const passlocal = require('passport-local-mongoose');
const bodyParser = require('body-parser');

///Configure GunJS and user schema
require('gun-mongo');
const gun = new Gun({
    file: false,

    mongo: {
        host: 'localhost',
        port: '27017',
        username: null,
        password: null,
        database: 'gun',
        collection: 'gun-mongo',
        query: ''
    }
});    
const user_gun = gun.user();


///Configure body-parser and set static dir path.
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: "alongsecretonlyiknow_asdlfkhja465xzcew523",
    resave: false,
    saveUninitialized: false
}));

///Configure Passport
app.use(passport.initialize());
app.use(passport.session());

//Configure MongoDB and Schema
mongoose.connect('mongodb://localhost:27017/gun', {useNewUrlParser: true, useUnifiedTopology: true});

const user_schema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            minlength: 5
        }
    }
);

user_schema.plugin(passlocal);
const Passport_User_Model = mongoose.model('User', user_schema);

passport.use(Passport_User_Model.createStrategy());
passport.serializeUser(Passport_User_Model.serializeUser());
passport.deserializeUser(Passport_User_Model.deserializeUser());

const discussion_schema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.ObjectId,
            required: true
        },
        video_url : {
            type: String
        },
        comments : [
            {
                user_id: {
                    type: mongoose.ObjectId,
                    required: true
                },
                content: String
            }
        ]
    }
);

const Discussion_Model = mongoose.model('Dicussion', discussion_schema);

app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/index.html")
});

app.get('/register', function(req, res){
    res.sendFile(__dirname + "/public/register.html")
});

app.post('/register', function(req, res){
    const register = {
        username: req.body.username,
        password: req.body.password
    };

    var fail_passport = undefined;
    var fail_gun      = undefined;

    //register the same info on passport and gun.
    user_gun.create(register.username, register.password, (msg) => {
        fail_gun = msg.err;
    });

    if (fail_gun){
        console.log("error - " + fail_gun);
        res.redirect('/register?error=' + fail_gun);
        return;
    }

    Passport_User_Model.register(register, register.password, (error, user) => {
        if (error){
            console.log("error - " + error);
            fail_passport = error;
            return;
        }
    });

    if(fail_passport){
        user_gun.delete(register.username, register.password);
        res.redirect('/register?error=' + fail_passport);
        return;
    }

    res.redirect('/');
});

function assert_invalid_session(req, res) {
    const state = req.isAuthenticated();

    if(!state){
        res.send(
            {
                message: 'not-logged-in',
                route  : '/login'
            }
        );
    }

    return !state;
}

app.get('/login', function(req, res) {
    res.sendFile(__dirname + "/public/login.html");
});

app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login?error=Username or password is invalid', failureMessage: true}), 
    function (req, res){
        res.redirect('/');
    }    
);

app.get('/contact', function(req, res) {
    res.sendFile(__dirname + "/public/contact.html");
});

app.get('/showcase', function(req, res) {
    res.sendFile(__dirname + "/public/showcase.html");
});

app.get('/get_started', function(req, res) {
    res.sendFile(__dirname + "/public/get_started.html");
});

app.get('/user', function(req, res) {
    res.sendFile(__dirname + "/public/user.html");
});

app.get('/get_current_user', function(req, res) {
    if (assert_invalid_session(req, res))
        return;

    res.send({message: "success", user:req.user});
});

app.get('/user_edit', function(req, res) {
    if (assert_invalid_session(req, res))
        return;

    res.sendFile(__dirname + 'user_edit.html');
});

app.get('/user_edit.js', function(req, res) {
    if (assert_invalid_session(req, res))
        return;

    res.sendFile(__dirname + '/user_edit.js');
});

app.get('/discussion', function(req, res) {
    res.sendFile(__dirname + "/public/get_started.html");
});

app.post('/post_reply', function(req, res) {
    if (assert_invalid_session(req, res))
        return;
});

app.get('/get_discussions', function(req, res) {
    
});

app.get('/get_comments', function(req, res) {
    
});
