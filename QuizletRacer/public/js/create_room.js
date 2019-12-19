$(document).ready(function () {

    var terms;
    var link;

    $('#alternatives').change(function () {

        if (this.checked) $('#number-of-alternatives-container').show();
        else $('#number-of-alternatives-container').hide();

    });

    $('#all-terms').change(function () {

        if (this.checked) $('#number-of-terms-container').hide();
        else $('#number-of-terms-container').show();

    });

    $('#load-quizlet').click(function () {

        link = $('#quizlet-link').val();

        $.post('/room/load_quizlet', {'quizlet-link': link}, function (resp) {

            if (!resp.success) alert(resp.message);
            else {
                alert(resp.message);
                terms = resp.terms;
            }

        });

    });

    $('#create-btn').click(function () {

        if (terms == null) {
            alert('Please load the quizlet before creating the room');
            return;
        }


        if (document.getElementById('alternatives').checked) {

            var alternatives_number = Number($('#alternatives-number').val());

            if (alternatives_number < 2 || alternatives_number > 4) {
                alert('The number of alternatives must be between 2 and 4');
                return;
            }

        }

        if (document.getElementById('all-terms').checked == false) {

            var term_number = Number($('#terms').val());

            if (term_number > Object.keys(terms).length || term_number < 1) {
                alert('Number of terms can not be higher than terms in set');
                return;
            }

        }

        var data = {

            'quizlet-link': link,
            'alternatives': document.getElementById('alternatives').checked,
            'number-of-alternatives': Number($('#alternatives-number').val()), 
            'all-terms': document.getElementById('all-terms').checked,
            'number-of-terms': Number($('#terms').val())
        }

        $.post('/room/create', data, function (resp) {



        });

    });
})