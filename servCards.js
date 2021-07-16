const express = require('express');
const app = new express();
var Cloudant = require('@cloudant/cloudant');
const dotenv = require('dotenv');
dotenv.config();

var passport = require('passport');
var cookieParser = require('cookie-parser');
//var bodyParser   = require('body-parser');
var session      = require('express-session');

function getDB(dbName) {
    var url = process.env.cloudant_url;
    var username = process.env.cloudant_username;
    var password = process.env.cloudant_password;
    var cloudant = Cloudant({ url:url, username:username, password:password });
    return cloudant.use(dbName);
}

const wordsDB = getDB('words');
const cardsDB = getDB('word-cards');
const usersDB = getDB('word-users');

require('./servAuth/passport')(passport, usersDB);

app.use(express.static('build'));
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session());
require('./servAuth/routes.js')(app, passport);

app.get('/info', (req, res)=> {
    //let db =getDB('words');
    wordsDB.info().then((data) =>{
        //console.log("Get user info  " +JSON.stringify(req.body));
        let isAuth = req.isAuthenticated();
        let newUser = {};
        if (isAuth) {
            newUser = JSON.parse(JSON.stringify(req.user));
            if (newUser.password)
                delete newUser.password;
        }
        res.json({docCount: data.doc_count, isAuth: isAuth, user: newUser });
        //res.send(data);
    }).catch((err)=>{
        console.log("Error from DB:" +err);
        res.status("404").send(err.toString());
    });
} )

app.get('/word/:id', (req, res) => {
    //let db =getDB('words');
    wordsDB.get(req.params.id).then((data) =>{
        //console.log("OK result:" +data);
        res.send(data);
    }).catch((err)=>{
        console.log("Error from DB:" +err);
        res.status("404").send(err.toString());
    });
})

//Return cards for specific user. If not Authenticated, return cards for user=Guest only
app.get('/cards/:user', (req, res) =>{
    //console.log(req.query);
    let user = req.isAuthenticated() ? req.session.passport.user : "Guest";
    if (user !== req.params.user) {
        res.status("401").send("Unauthorized User data access");
        return;
    }
    if (user === "Guest")
        user = "Vesko";
    let q = {
        selector: {
          "_id": { "$regex": "^"+user}
        },
        "fields": [
           "_id",
           "word",
           "correct",
           "answer",
           "wasCorrect"
        ],
        "sort": [
           {
              "_id": "desc"
           }
        ],
        //limit:7
    };
    if (req.query.limit) {
        const limit = parseInt(req.query.limit);
        if (isNaN(limit) || limit <=0) {
            res.status('400').send('Limit parameter must be positove number');
            return;
        }
        q ={...q, limit: limit};
    }
    if (req.query.order) {
        const order = req.query.order;
        if (order ==="asc" || order ==="desc")  
            q ={...q, sort: [{"_id": order}]};
        else {
            res.status('400').send('order parameter must be either asc or desc');
            return;
        }
    }
    //console.log(JSON.stringify(q));
    //let db = getDB('word-cards');
    cardsDB.find(q).then((data) => {
        res.send(data.docs)
    }).catch((err) => {
        console.log("Error from DB:" +err);
    })
})

//Save a Card. If not Authenticated, will save user=Guest instead
app.post('/card', (req, res) => {
    //let db = getDB('word-cards');
    let user = req.isAuthenticated() ? req.session.passport.user : "Guest";
    if (user !== req.body.user) {
        res.status("401").send("Unauthorized User data save");
        return;
    }
    if (user === "Guest")
        user = "Vesko";
    //let user = req.isAuthenticated() ? req.body.user : "Vesko";
    let record = {
        _id: user +"&" + new Date().toISOString(), 
        word: req.body.word,
        answer: req.body.answer,
        correct: req.body.correct,
        wasCorrect: req.body.wasCorrect
    }
    //console.log(JSON.stringify(req.body));
    cardsDB.insert(record).then(() => {
        res.send("OK");
    }).catch((err) =>{        
        res.status("404").send(err.toString());
    });
})

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.status(404).send("Not authorized");
}

app.listen(8080, () => {
    console.log(`Listening at http://localhost:8080`)
})