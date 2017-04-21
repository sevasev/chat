const app = require('express')();
const http = require('http').Server(app);
const port = 8080;
const io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.render('index.ejs', { title: "Testing!"});
});

io.on('connection', function (socket) {

    console.log("user connected");

    socket.on();

    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(port, function () {
    console.log("Listening on port " + port + "....");
});

