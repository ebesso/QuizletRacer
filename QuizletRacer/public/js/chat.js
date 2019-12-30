$(document).ready(function () {


    $('#send-button').click(function () {

        var message = $('#message-input').val();
        window.socket.emit('new-chat-message', { message: message });
        window.add_message('You', message);

        $('#message-input').val('');

    });

    socket.on('new-chat', function (data) {

        window.add_message(data.sender, data.message);

    });


    window.add_message = function (sender, message) {

        if (sender != null) {
            
            $('#chat').append(`<li class="chat-item"><strong class="chat-name">${sender}</strong>: ${message}</li>`)

        }
        else {

            $('#chat').append(`<li class="chat-item">${message}</li>`)

        }
    }

});
