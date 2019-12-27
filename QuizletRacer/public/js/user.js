$(document).ready(function () {

    var socket = window.socket;

    socket.on('update-users', function (data) {

        if (window.started == false) {

            $('.user-row').remove();

            for (var i = 0; i < data.users.length; i++) {

                var user = data.users[i];

                $('#users').append(`<tr class="user-row"><td>${user.name}</td><td>${user.ready}</td></tr>`);

            }

        } else {

            $('.leaderboard-row').remove();

            for (var i = 0; i < data.users.length; i++) {

                var user = data.users[i];

                $('#leaderboard').append(`<tr class="leaderboard-row"><td>${user.name}</td><td>${user.correct}</td></tr>`);

            }

        }

        
    });

});