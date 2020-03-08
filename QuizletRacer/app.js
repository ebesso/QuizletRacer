const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/george', { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', function () {
    console.log('Failed to connect to database');
});

db.on('open', function () {
    console.log('Connected to database');
    Room.clearRooms();
    User.clearUsers();

});

const express = require('express');
const app = express();
const port = 3000;

const server = require('http').Server(app);
const io = require('socket.io')(server);

const socket_connections = require('./socket/socket')(io);

const exphbs = require('express-handlebars');
const hbs = exphbs.create({

	defaultLayout: 'main',
	extname: '.hbs',
	defaultLayout: 'main'

});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(require('serve-static')('public'))

const index = require('./routes/index');
const rooms = require('./routes/rooms');

const Room = require('./models/room');
const User = require('./models/user');


app.use(index);
app.use('/room', rooms);

server.listen(port, () => console.log('Server started'));
