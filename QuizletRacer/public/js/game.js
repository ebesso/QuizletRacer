$(document).ready(function () {

    var socket = window.socket;

    var terms = {}
    var alternatives;

    var started = false;

    var term_index = 0;

    if (started) {
        $('#intermission-container').hide();
        $('#game-container').show();
    } else {
        $('#intermission-container').show();
        $('#game-container').hide();

    }

    socket.on('game-start', function (data) {

        terms = data.terms;
        alternatives = data.alternatives;

        console.log('Game started');            

        console.log(terms);
        console.log('Alternatives: ' + alternatives);

        start_game();

    });

    socket.on('game-update', function (data) {



    });

    $('#ready').click(function () {

        socket.emit('player-ready');

    });

    function start_game() {

        $('#intermission-container').hide();

        started = true;

        term_index = 0;

    }

    function next_term() {

           

    }

    function submit_answer() {




    }

    function end_game() {

        started = false;

        $('#intermission-container').show();
        $('#game-container').hide();

        console.log('The game has ended');

    }

});