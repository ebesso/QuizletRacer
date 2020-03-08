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

            //Add correct answer
            selected.push(definitions[index]);

            for (var i = 0; i < 3; i++)
            {

                if (i == definitions.length - 1) {
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

            selected = shuffle(selected);

            selected.forEach(function (item) {

                $('#alternatives').append('<button class="btn btn-outline-secondary alternative-button col-' + alt_size + '" type="button" data-answer="' + definitions.indexOf(item) + '">' + item + '</button>')

            });

        }
        $('#question').html(terms[index]);



    }

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    async function submit_answer(answer) {

        console.log(answer);

        if (answer.toLowerCase() == definitions[index].toLowerCase()) {

            socket.emit('player-answer');

            console.log('Answer correct');

            index++;

            if (index != terms.length) {

                next_term();

            }



        } else {

            if (alternatives) {

                $('#alternatives-container').hide();

                for (var i = 3; i > 0; i--) {

                    $('#question').html('Incorrect Answer: ' + i );

                    await sleep(1000);

                }
                $('#alternatives-container').show();

                next_term();



            }


        }


    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

        answer = definitions[Number($(this).attr('data-answer'))];

        submit_answer(answer);

    });

});
