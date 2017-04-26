const app = require('express')();
const http = require('http').Server(app);
const express = require('express');
const io = require('socket.io')(http);
const mongo = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');

const port = 8080;
const url = 'mongodb://localhost:27017/chat';

function __getAllMessages(db, callback) {
    db.collection('messages').find().toArray(callback);
}

function getMessages(socket) {
    mongo.connect(url, function(err, db) {
        if (err) {
            socket.emit('error', err);
        }
        __getAllMessages(db, function(err, result) {
            if (err) {
                next(err);
            }
            io.emit('messages', result);
            db.close();
        });
    });
}

function __saveMessage(db, message, callback) {
    db.collection('messages').insertOne({"message": message}, function(err, result) {
        if (err) {
            next(err);
        }
        callback();
    });
}

function saveMessages(socket, message) {
    mongo.connect(url, function(err, db) {
        __saveMessage(db, message, function(result) {
            db.close();
            socket.emit('message', message);
        });
    });
}

app.use(bodyParser.urlencoded({
    extended: true
}));

function __saveUserData(db, username, password, callback) {
    db.collection('userData').insertOne({"username": username, "password": password}, function(err) {
    if (err) {
        throw err; // write logics for the same name case (nick must be original
    }
    callback();
    });
}

function saveUserData(username, password, res) {
    mongo.connect(url, function (err, db) {
        let save = true;
        db.collection('userData').find().toArray(function (err, result) {
            let len = result.length;
            for (let i = 0; i < len; i++) {
                if (result[i].username == username) {
                    save = false;
                }
            }
            if (save === true) {
                __saveUserData(db, username, password, function () {
                    db.close();
                });
                formPassed(res, "Form is OK!");
            } else {
                formFailed(res, "Error!")
            }
        });
    });

}


app.post('/', function (req, res) {
    userName = req.body.user.username;
    userPassword = req.body.user.password;
    saveUserData(userName, userPassword, res);
});

app.get('/login', function (req, res) {
    res.render('pageLogin.ejs', { title: "login"});
});

app.post('/login', function (req, res) {
    username = req.body.user.username;
    password = req.body.user.password;
    auth(username, password, res);
});

function auth(username, password, res) {
    mongo.connect(url, function (err, db) {
        db.collection('userData').find().toArray(function (err, result) {
            console.log("1");
            let len = result.length;
            let logged = false;
            for (let i = 0; i < len; i++) {
                console.log("2");
                if (result[i].username == username) {
                    console.log("3");
                    if (result[i].password == password) {
                        logged = true;
                    }
                }
            }
            if (logged) {
                formPassed(res, "Hello, " + username + "!");
            } else {
                authFailed(res);
            }
        });
        db.close();
    });
}

function formPassed(res, feedback) {
    res.render('index.ejs', { title: feedback });
}

function formFailed(res, feedback) {
    res.render('errNormalPage.ejs', { title: feedback } );
}

function authFailed(res) {
    res.render('authFailed.ejs', { title: 'invalid data' })
}

app.get('/', function(req, res) {
    res.render('page.ejs', { title: "authorizating!"});
});

io.on('connection', function (socket) {

    getMessages(socket);

    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
        saveMessages(socket, msg);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(port, function () {
    mongo.connect(url, function(err, db) {
        try {
            db.collection('messages').remove({});
        }
        catch (err) {}
        db.close();
    });
    console.log("Listening on port " + port + "....");
});





// ADDITIONAL SOURCES


// extracting data from DB
// function testUserDataSaving(callback) {
//     mongo.connect(url, function (err, db) {
//         db.collection('userData').find().toArray(callback);
//         db.close();
//         if (err) {
//             next(err)
//         }
//     });
// }
