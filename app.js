/*Run npm i express, better-sqlite3, dotenv, express-session, bcrypt */

const multer = require('multer');
const upload = multer();
const bcrypt = require("bcrypt");
const sqlite3 = require('better-sqlite3')
const db = sqlite3('./tverfaglig.db', {verbose: console.log})
const session = require('express-session')
const dotenv = require('dotenv');


const express = require('express');
const path = require('path');
const app = express();

dotenv.config()

const saltRounds = 10
const staticPath = path.join(__dirname, 'public')
    
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))


app.post('/login', upload.none(), (req, res) => {
    console.log(req.body)
    try {
        let user = checkUserPassword(req.body.username, req.body.password) 
        if ( user != null) {
            req.session.loggedIn = true
            req.session.username = req.body.username
            req.session.userid = user.userid
    
        //res.redirect('/');
        // Pseudocode - Adjust according to your actual frontend framework or vanilla JS
 
        } 
        if (user == null || !req.session.loggedIn) {
            res.json(null);
        }
        else {res.json(user)}

    }
    catch {
       
       res.json(null);
    }

})

app.post('/register', (req, res) => {
    console.log("registerUser", req.body);
    const reguser = req.body;
    const user = addUser(reguser.firstname, reguser.lastname, reguser.username, reguser.email, reguser.password)
    // Redirect to user list or confirmation page after adding user
    if (user)   {
        req.session.username = user.username
        req.session.userid = user.userid
        //res.redirect('/'); 
        // Pseudocode - Adjust according to your actual frontend framework or vanilla JS


    }
    res.send(true)
});



function checkUserPassword(username, password){
    const sql = db.prepare('SELECT user.id as userid, username');
    let user = sql.get(username);
if (user && bcrypt.compareSync(password, user.password)) {
        return user 
    } else {
        return null;
    }
}

function checkLoggedIn(req, res, next) {
    console.log('CheckLoggedIn')
    if (!req.session.loggedIn) {
        res.sendFile(path.join(__dirname, "\public\\login.html"));
    } else {
        next();
    }
    
}

app.post('/user-add', (req, res) => {
    console.log(req.body)
    addUser(req.body.username, req.body.password)
    res.sendFile(path.join(__dirname, "public/app.html"));
     
});

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.sendFile(path.join(__dirname, "public/login.html"));
})


function addUser(firstname, lastname, username, email, password){
    const hash = bcrypt.hashSync(password, saltRounds)
    let sql = db.prepare("INSERT INTO user (firstname, lastname, username, email, password)" + 
                         " values (?, ?, ?, ?, ?)")
    const info = sql.run(firstname, lastname, username, email, hash)
    
    //sql=db.prepare('select user.id as userid, username, task.id as taskid, timedone, task.name as task, task.points from done inner join task on done.idtask = task.id where iduser = ?)')
    sql = db.prepare('SELECT user.id as userid FROM user');
    let rows = sql.all(info.lastInsertRowid)  
    console.log("rows.length", rows.length)

    return rows[0]
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/currentUser', checkLoggedIn,  (req, res) => {// This will log the userid to the console
    console.log(`User ID: ${req.session.userid}`);
    console.log(`Username: ${req.session.username}`);
    res.send([req.session.userid, req.session.username]);
});

app.get('/', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.listen(3000, () => {
    console.log('Server is running on localhost:3000');
});