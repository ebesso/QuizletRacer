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

        for (var item in data.terms) {

            definitions.push(data.terms[item].definition);
            terms.push(data.terms[item].term);

        }

        alternatives = data.alternatives;

        console.log('Game started');            
        console.log('Alternatives is ' + alternatives);

        start_game();

    });

    socket.on('game-end', function (data) {

        window.add_message(null, data.winner.name + ' won');
        end_game();

    });

    $('#ready').click(function () {

        socket.emit('player-ready');

    });


    function start_game() {

        $('#intermission-container').hide();
        $('#game-container').show();

        if (alternatives == true) {
            $('#input-container').hide();
            $('#alternatives-container').show();

        } else {
            $('#input-container').show();
            $('#alternatives-container').hide();
        }

        window.add_message(null, 'Game has started');
        window.started  = true;

        index = 0;

        next_term();

    }

    function next_term() {

        if (alternatives == true) {

            $('#alternatives').empty();

            var selected = []

            for (var i = 0; i < 4; i++)
            {

                if (i == definitions.length) {
                    break;
                }

                while (true) {
                    var alternative = definitions[Math.floor(Math.random() * definitions.length)];

                    if (selected.includes(alternative) == false) {
                        selected.push(alternative);
                        break;
                    }
                }
            }

            var alt_size = 12 / selected.length;

            selected.forEach(function (item) {

                $('#alternatives').append('<button class="btn btn-outline-secondary alternative-button col-' + alt_size + '" type="button" data-answer="' + item + '">' + item + '</button>')

            });

        }
        $('#question').html(terms[index]);



    }

    function submit_answer(answer) {

        console.log('Answer: ' + answer.toLowerCase());
        console.log('Definition: ' + definitions[index].toLowerCase());

        if (answer.toLowerCase() == definitions[index].toLowerCase()) {

            socket.emit('player-answer');

            console.log('Answer correct');

            index++;

            if (index != terms.length) {

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

        $('#ready').prop('checked', false);

        console.log('The game has ended');

    }

    $('#answer-button').click(function () {

        answer = $('#answer').val();

        submit_answer(answer);

        $('#answer').val(''); 

    });

    $('#answer').keypress(function (e) {

        if (e.which == 13) {

            answer = $('#answer').val();

            submit_answer(answer);

            $('#answer').val(''); 

        }

    });

    $(document).on('click', '.alternative-button' ,function () {

        console.log('Selected: ' + $(this).attr('data-answer'));

        answer = $(this).attr('data-answer');

        submit_answer(answer);

    });

});
