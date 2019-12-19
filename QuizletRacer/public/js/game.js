$(document).ready(function () {

    var socket = window.socket;

    var terms = {}
    var started = false;

    socket.on('game-start', function (data) {

        terms = data.terms;

    });

    socket.on('game-update', function (data) {



    });

    $('#ready').click(function () {

        socket.emit('player-ready');

        //if ($(this).prop('checked') == true) {

        //    console.log('Ready');

        //} else {

        //    console.log('Not ready');

        //}

    });

    

});