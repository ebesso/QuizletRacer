$(document).ready(function () {

    var socket = window.socket;

    var terms = []
    var definitions = []

    var alternatives;

    window.started = false;

    var index = 0;

    if (window.started) {
        $('#intermission-container').hide();
        $('#game-container').show();
    } else {
        $('#intermission-container').show();
        $('#game-container').hide();

    }

    socket.on('game-start', function (data) {

        console.log(data);

        for (var item in data.terms) {

            definitions.push(data.terms[item].definition);
            terms.push(data.terms[item].term);

        }

        alternatives = data.alternatives;

        console.log('Game started');            

        start_game();

    });

    socket.on('game-end', function (data) {

        alert(data.winner.name + ' has won the game');
        end_game();

    });

    $('#ready').click(function () {

        socket.emit('player-ready');

    });


    function start_game() {

        $('#intermission-container').hide();
        $('#game-container').show();

        window.started  = true;

        index = 0;

        next_term();

    }

    function next_term() {

        console.log(terms[index]);

        $('#term').html(terms[index]);

    }

    function submit_answer(answer) {

        console.log('Answer: ' + answer.toLowerCase());
        console.log('Definition: ' + definitions[index].toLowerCase());

        if (answer.toLowerCase() == definitions[index].toLowerCase()) {

            socket.emit('player-answer');

            console.log('Answer correct');

            index++;

            if (index == terms.length - 1) {

                end_game();

            } else {

                next_term();

            }





        } else {

            console.log('Answer incorrect');

        }


    }

    function end_game() {

        window.started = false;

        $('#intermission-container').show();
        $('#game-container').hide();

        console.log('The game has ended');

    }

    $('#answer-btn').click(function () {

        answer = $('#answer-input').val();

        submit_answer(answer);

        $('#answer-input').val(''); 

    });

});