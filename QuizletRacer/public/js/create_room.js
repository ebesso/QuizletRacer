$(document).ready(function () {

    //var terms;
    var link;
    var alternatives = false;
    var answerDefinitions = true;

    $('#alternative-btn').click(function () {

        if (alternatives == false) {

            $(this).addClass('btn-secondary');
            $(this).removeClass('btn-outline-secondary');

            $(this).html('Alternatives ON');

            alternatives = true;
            
        } else {

            $(this).removeClass('btn-secondary');
            $(this).addClass('btn-outline-secondary');

            $(this).html('Alternatives OFF');

            alternatives = false;

        }

    });

    $('#answer-btn').click(function () {

        if (answerDefinitions == false) {

            $(this).addClass('btn-secondary');
            $(this).removeClass('btn-outline-secondary');

            $(this).html('Answer with Definitions');

            answerDefinitions = true;

        } else {

            $(this).removeClass('btn-secondary');
            $(this).addClass('btn-outline-secondary');

            $(this).html('Answer with Terms');

            answerDefinitions = false;

        }

    });

    //$('#load-quizlet').click(function () {

    //    $.post('/room/load_quizlet', { 'quizlet-link': $('#quizlet-link').val()}, function (resp) {

    //        if (!resp.success) alert(resp.message);

    //        else {
    //            link = $('#quizlet-link').val();
    //            alert(resp.message);
    //            terms = resp.terms;
    //        }

    //    });

    //});

    $('#create-btn').click(function () {

        //if (terms == null) {
        //    alert('Please load the quizlet before creating the room');
        //    return;
        //}

        var data = {

            'quizlet-link': $('#quizlet-link').val(),
            'alternatives': alternatives,
            'answer-definition': answerDefinitions
        }

        $.post('/room/create', data, function (resp) {

            if (resp.success == true) {

                window.location.replace('/room/connect/' + resp.code);

            } else {
                alert('Failed to create room, check ur url');
            }

        });

    });
})