const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//DATABASE CONNECTION
var db = mongoose.createConnection('mongodb://localhost:27017/cricket', { useNewUrlParser: true, useUnifiedTopology : true });

if (!db) {
    console.log("False");
}
else {
    console.log("True");
}

//REGISTER USER
app.get('/', function (req, res) {
    res.sendFile((path.join(path.resolve('registeruser.html'))));
});

app.post('/register', function (req, res) {   
    db.collection("User").insertOne(
        {
            "username": req.body.username,
            "password": req.body.password,
            "role": req.body.role
        },
        function (err) {
            if (err) throw err;
            var token = jwt.sign({
                username : req.body.username,
                password : req.body.password,
                role : req.body.role
            },"masterkey");
            res.send({token : token,msg : "Registered"});
        }
    )
});

//LOGIN USER
app.get('/userlogin', function (req, res) {
    res.sendFile(path.join(path.resolve('loginuser.html')));
});

app.post('/login', function (req, res){
    db.collection("User").find({
        username : req.body.username,
        password : req.body.password
    }).toArray(function (err, result){
        if (err){
            res.send("Enter Credentials");
        }
        else if (result.length === 0){
            res.send("Credentials are Wrong");
        }
        else{
            res.sendFile(path.join(path.resolve('afterlogin.html')));
        }
    })
});

//CREATE TEAM
app.get('/team/create', function (req, res) {
    res.sendFile((path.join(path.resolve('createteam.html'))));
});

app.post('/team/create' ,(req, res) => {
    db.collection("Team").insertOne(
        {
            "name": req.body.name,
            "logo": req.body.logo,
            "tagline": req.body.tagline,
            "createdby": req.body.createdby
        },
        function (err) {
            if (err) throw err;
            res.send("Successfully Created Team");
        }
    )
});

//TEAM LIST
app.get('/team/list', (req, res) => {
    db.collection("Team").find({
    }).toArray(function (err, result) {
        if (err) throw err;
        res.send(result)
        console.log(result);
    })
});

//TEAM DELETE
app.get('/team/delete', function (req, res) {
    res.sendFile(path.join(path.resolve('deleteteam.html')));
});

app.post('/team/delete',(req, res) => {
    var a = req.body.name;
    var b = a;
    db.collection("Team").deleteOne({
        name: req.body.name,
    }, function (err) {
        if (err) throw err;
    });
    db.collection("Player").deleteMany({
        team_id : b,
    }, function(err) {
        if (err) throw err;
    });
    res.send("Deleted")
    })

//CREATE PLAYER
app.get('/player/create', function (req, res) {
    res.sendFile(path.join(path.resolve('createplayer.html')));
});

app.post('/player/create', (req, res) => {
    db.collection("Player").insertOne(
        {
            "name": req.body.name,
            "team_id": req.body.teamid,
            "skill": req.body.skill,
            "created_by": req.body.createdby
        },
        function (err) {
            if (err) throw err;
            res.send("Successfully Created Player");
        }
    )
});

//PLAYERS LIST
app.get('/player/list', (req, res) => {
    db.collection("Player").find({
    }).toArray(function (err, result) {
        if (err) throw err;
        res.send(result)
    })
});

//PLAYER DELETE
app.get('/player/delete', function (req, res) {
    res.sendFile(path.join(path.resolve('deleteplayer.html')));
});

app.post('/player/delete',(req, res) => {
    db.collection("Player").deleteOne({
        name: req.body.name,
    }, function (err) {
        if (err) throw err;
        res.send("Deleted");
    })
});

app.listen(3000);