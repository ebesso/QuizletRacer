$(document).ready(function () {


    var hasConnected = false;

    const name = $('#username').val();
    const code = $('#code').val();

    const socket = io('http://localhost:3000/');
    window.socket = socket;

    socket.on('connect', function () {

        console.log('Connected to server');
        hasConnected = true;

        socket.emit('initialize', { name: name, code: code });

    });

    socket.on('leave', function () {

        window.location.href = '/Google.com';

    });

    socket.on('message', function (data) {

        console.log(data);

    });

    socket.on('joined-room', function (data) {

        window.add_message(null, `${data.name} has connected`);

    });

    socket.on('left-room', function (data) {

        window.add_message(null, `${data.name} has disconnected`);

    });



});