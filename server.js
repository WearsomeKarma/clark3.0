const express   = require('express');
const session   = require('express-session');
const mongoose  = require('mongoose');
const Gun       = require('gun');
const passport  = require('passport');
const passlocal = require('passport-local-mongoose');

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

const app = express();
app.use(session({
    secret: "alongsecretonlyiknow_asdlfkhja465xzcew523",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

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

const passport_user = mongoose.model('User', userSchema);

app.get('/', function(req, res) {
    res.sendFile("/index.html");
});

app.get('/register', function(req, res){

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
    res.sendFile();
});

app.get('/user', function(req, res) {
    
});

app.get('/user_edit', function(req, res) {
    //is_auth

    res.sendFile(__dirname + 'user_edit.html');
});

app.get('/user_edit.js', function(req, res) {
    res.sendFile(__dirname + '/user_edit.js');
});

app.get('/discussion', function(req, res) {
    
});

app.get('/get_discussions', function(req, res) {
    
});
