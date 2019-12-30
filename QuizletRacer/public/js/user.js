$(document).ready(function () {

    var socket = window.socket;

    socket.on('update-users', function (data) {

        if (window.started == false) {

            $('.user-row').remove();

            for (var i = 0; i < data.users.length; i++) {

                var user = data.users[i];

                var ready;

                if (user.ready) {

                    ready = 'Ready';
                } else {
                    ready = 'Not Ready';
                }

                $('#users').append(`<tr class="user-row"><th scope="row">${i + 1}</th><td>${user.name}</td><td>${ready}</td></tr>`);
            }

        } else {

            $('.leaderboard-row').remove();

            for (var i = 0; i < data.users.length; i++) {

                var user = data.users[i];

                $('#leaderboard').append(`<tr class="leaderboard-row"><th scope="row">${i + 1}</th><td>${user.name}</td><td>${user.correct}</td></tr>`);

            }

        }

        
    });

});