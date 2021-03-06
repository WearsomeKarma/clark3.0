const MAX_DB_QUERY = 100;

require('dotenv').config();
const express   = require('express');
const session   = require('express-session');
const mongoose  = require('mongoose');
const Gun       = require('gun');
const passport  = require('passport');
const passlocal = require('passport-local-mongoose');
const bodyParser = require('body-parser');

///Configure GunJS and user schema
const gun = new Gun({
    file: false
});    
const user_gun = gun.user();


///Configure body-parser and set static dir path.
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));

///Configure Passport
app.use(passport.initialize());
app.use(passport.session());

//Configure MongoDB and Schema
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const user_schema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            minlength: 5
        },
        profile_img: {
            type: String
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
        author_id : {
            type: mongoose.ObjectId
        },
        title : {
            type: String
        },
        date : {
            type: Date
        },
        root_content_id : {
            type: mongoose.ObjectId,
            unique: true
        }
    }
);

const Discussion_Model = mongoose.model('Discussion', discussion_schema);

const content_schema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.ObjectId,
            required: true
        },
        video_url : {
            type: String
        },
        discussion_id : {
            type : mongoose.ObjectId
        },
        date : {
            type : Date
        },
        content_paragraph : {
            type: String,
            required: function() {
                return this.content_paragraph.length >= 10;
            }
        },
        reply_id : {
            type: mongoose.ObjectId
        }
    }
);

const Content_Model = mongoose.model('Content', content_schema);

app.listen(process.env.PORT ?? 3000, function () {
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
        password: req.body.password,
        profile_img: ""
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
            console.log("passport error - " + error);
            user_gun.delete(register.username, register.password);
            res.redirect("/register?error=" + error);
            return;
        }

        res.redirect('/login?info=Account creation successful! Please login again.');
    });

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

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

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

app.get('/get_user', function(req, res) {
    Passport_User_Model.findOne
    (
        {_id: req.query.user_id},
        function (error, user) {
            if (error) {
                res.send({message: error, user: {}});
                return;
            }
            res.send({message: "success", user: user});
        }
    );
});

app.post('/user_edit', function(req, res) {
    if (assert_invalid_session(req, res)) {
        res.redirect('/login');
        return;
    }

    const user_id = req.user._id;
    const update_field = { $set: {}};
    if (req.body.profile_img) update_field.$set.profile_img = req.body.profile_img;

    Passport_User_Model
        .update({_id: user_id}, update_field, function (error, user) 

            {});

    res.redirect('/user?user_id=' + user_id);
});

app.get('/discussion', function(req, res) {
    res.sendFile(__dirname + "/public/topic.html");
});

app.get('/new_discussion', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }

    res.sendFile(__dirname + '/src/new_topic.html');
});

app.get('/src/new_topic.js', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }

    res.sendFile(__dirname + '/src/new_topic.js');
})

app.post('/new_discussion', function(req, res) {
    if(!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }

    const discussion_payload = {
        author_id: req.body.author_id,
        title: req.body.title,
        video_url: req.body.video_url,
        date : new Date(),
        content: req.body.content
    };

    if (!req.user._id.equals(discussion_payload.author_id)) {
        res.redirect('/new_discussion?=' + 'A database error has occured. Consider relogging to fix the issue.');
        return;
    }

    const content_payload = {
        user_id: discussion_payload.author_id,
        video_url: discussion_payload.video_url,
        content_paragraph: discussion_payload.content
    }

    function save_discussion(callback) {
        const content = new Content_Model(content_payload);
        content.save(function (error) {
            if (error) {
                if (callback)
                    callback(error);
                return;
            }

            discussion_payload.root_content_id = content._id;

            const discussion = new Discussion_Model(discussion_payload);
            discussion.save(function (error) {
                any_error = error;
                if (callback)
                    callback(error, discussion);
            });
        });
    }

    save_discussion((error, discussion) => {
        if (error) {
            console.log(error);
            res.redirect('/new_discussion?error=' + error);
            return;
        }

        res.redirect('/discussion?post_id=' + discussion._id);
    });
});

app.post('/post_reply', function(req, res) {
    if (assert_invalid_session(req, res))
        return;

    const content_payload = {
        user_id       : req.user._id,
        video_url     : req.body.video_url,
        discussion_id : req.body.discussion_id,
        content       : req.body.content,
        date          : new Date(),
        reply_id      : req.body.reply_id
    };

    const content = new Content_Model(content_payload);
    content.save(function (error) {
        if (error) {
            res.redirect(`/topic?post_id=${req.body.discussion_id}&error=${error}`);
            return;
        }

        res.redirect('/discussion?post_id' + req.body.discussion_id);
    });
});

app.get('/get_discussion_by_id', function(req, res) {
    const discussion_id = req.query.discussion_id;
    if (!discussion_id){
        res.send({message: 'id null', discussion: {}});
        return;
    }

    Discussion_Model
        .findOne({_id: discussion_id})
        .exec(function(error, discussion) {
            if (error) {
                console.log(error);
                res.send({message: 'database error', discussion: {}});
                return;
            }

            res.send({message: 'success', discussion: discussion});
        });
});

app.get('/get_discussions', function(req, res) {
    const discussion_query = req.query.discussion_query;

    const author_id = discussion_query?.author_id;

    const skip = discussion_query?.skip ?? 0;
    if (skip < 0) skip = 0;

    const limit = discussion_query?.limit ?? 10;
    if (limit > MAX_DB_QUERY) limit = MAX_DB_QUERY;

    const search_text = discussion_query?.search_text;

    let query = { $and: []};
    let not_query_any = true;
    if (author_id) query.$and.push({ author_id: author_id });
    if ((search_text?.length ?? 0) > 0) query.$and.push({ title: { $regex: search_text, $options: 'i'}});

    if (query.$and.length === 0)
        query = {};

    Discussion_Model
        .find(query)
        .count({}, function (error, count) { 
            Discussion_Model
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort('date')
                .exec(function (error, discussions) {
                    if (error) {
                        console.log(error);
                        res.send({message: error, discussions: {}});
                        return;
                    }

                    res.send
                    (
                        {
                            message: "success", 
                            discussions: discussions,
                            page_count: (count / limit) + 1
                        }
                    );
                });
        });
});

app.get('/get_content_by_id', function(req, res) {
    Content_Model
        .findOne({_id: req.query.content_id})
        .exec(function (error, content)
            {
                if (error) {
                    res.send({message: error, content: {}});
                    return;
                }

                res.send({message: 'success', content: content});
            });
});

app.get('/get_contents', function(req, res) {
    const query = req.query;

    const skip = query?.skip ?? 0;
    if (skip < 0) skip = 0;

    const limit = query?.limit ?? 10;
    if (limit > MAX_DB_QUERY) limit = MAX_DB_QUERY;

    Content_Model
        .find(query.content_query ?? {})
        .count({}, function(error, count) {
            Content_Model
                .find(query.content_query ?? {})
                .skip(query.skip ?? 0)
                .limit(query.limit ?? 10)
                .sort('date')
                .exec(function (error, contents) {
                    if (error) {
                        res.send({message: "database error", contents: {}});
                        return;
                    }

                    res.send
                    (
                        {
                            message: "success", 
                            contents: contents,
                            page_count: (count / limit) + 1
                        }
                    );
                });
        });
});

app.post('/post_content', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }
    const discussion_id = req.body.discussion_id;
    const reply_id = req.body.reply_id;
    const content_paragraph = req.body.content;

    if (!discussion_id) {
        res.send({message: 'database error'});
        return;
    }

    const content_payload = {
        user_id: req.user._id,
        reply_id: reply_id,
        discussion_id: discussion_id,
        date: new Date(),
        content_paragraph: content_paragraph
    }

    const content = new Content_Model(content_payload);
    content.save((error) => {
        if (error) {
            res.redirect(`/discussion?post_id=${discussion_id}&error=${error}`);
            return;
        }

        res.redirect('/discussion?post_id=' + discussion_id);
    });
});
