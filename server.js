const app = require('express')();
const http = require('http').Server(app);
const port = 8080;
const io = require('socket.io')(http);
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/chat';
const express = require('express');
const bodyParser = require('body-parser');

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

function __saveUserData(db, name, email, password, callback) {
    db.collection('userData').insertOne({"_id": name, "email": email, "password": password}, function(err, result) {
    if (err.name == 'MongoError' && err.code == 11000) {
        throw err; // write logics for the same name case (nick must be original
    }
    callback();
    });
}

function saveUserData(name, email, password) {
    mongo.connect(url, function (err, db) {
        __saveUserData(db, name, email, password, function () {
            db.close();
        });
    })
}

function testUserDataSaving(callback) {
    mongo.connect(url, function (err, db) {
        console.log(db.collection('userData').find().toArray(callback));
        db.close();
        if (err) {
            next(err)
        }
    });

}

app.post('/', function (req, res) {
    userName = req.body.user.name;
    userEmail = req.body.user.email;
    userPassword = req.body.user.password;
    saveUserData(userName, userEmail, userPassword);
    testUserDataSaving(function(err, result) {
        console.log("result: " + result);
        if (err) {
            next(err);
        }});
    res.send("It's okay");
});

app.get('/', function(req, res) {
    res.render('page.ejs', { title: "Testing! Now with MongoDB!"});
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
