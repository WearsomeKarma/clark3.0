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

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            minlength: 5
        },
        fullname: {
            type: String,
            required: true
        }
    }
);

const passport_usermodel = mongoose.model('User', userSchema);

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
    user_gun.create(username, password, (msg) => {
        fail_gun = msg.err;
    });

    if (fail_gun){
        res.send({message: fail_gun});
        return;
    }

    passport_user.register(register, register.password, (error, user) => {
        if (error){
            fail_passport = error;
            return;
        }
    });

    if(fail_passport){
        user_gun.delete(username, password);
        res.send({message: fail_passport});
    }
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + "/public/login.html");
});

app.post('/login', function(req, res) {
    
});

app.get('/user', function(req, res) {
    
});

app.get('/get_current_user', function(req, res) {
    if (!req.isAuthenticated()){
        res.send({message: "not-logged-in"});
        return;
    }

    return {message: "success", user:req.user};
});

app.get('/user_edit', function(req, res) {
    //is_auth
    if (!req.isAuthenticated()) {
        res.send({ message: "not-logged-in"});
        return;
    }

    res.sendFile(__dirname + 'user_edit.html');
});

app.get('/user_edit.js', function(req, res) {
    res.sendFile(__dirname + '/user_edit.js');
});

app.get('/discussion', function(req, res) {
    
});

app.get('/get_discussions', function(req, res) {
    
});
