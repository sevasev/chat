const app = require('express')();
const http = require('http').Server(app);
const port = 8080;
const io = require('socket.io')(http);
const mongo = require('mongodb').MongoClient;
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


app.get('/', function(req, res) {
    res.render('index.ejs', { title: "Testing! Now with MongoDB!"});
});

io.on('connection', function (socket) {

    console.log("user connected");

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
            console.log("BD cleaned")
        }
        catch (err) {}
        db.close();
    });
    console.log("Listening on port " + port + "....");
});

