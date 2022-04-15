const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.sendFile("/index.html");
});

app.get('/user', function(req, res) {
    
});

app.get('/user_edit', function(req, res) {
    //is_auth

    res.sendFile(__dirname + 'user_edit.html');
});

app.get('/user_edit.js', function(req, res) {
    res.sendFile(__dirname + '/user_edit.js');
})l

app.get('/discussion', function(req, res) {

});

app.get('/get_discussions', function(req, res) {

});
