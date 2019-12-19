const User = require('./../models/user');

module.exports = function(socket){

    socket.on('new-chat-message', function (data) {

        User.findUser(socket.id, function (err, user) {

            if (err) console.log(err.message);
            else {

                user.findRoom(function (err, room) {

                    if (err) console.log(err.message);
                    else {

                        console.log(`${user.name}: ${data.message}`)

                        socket.to(room.code).emit('new-chat', { sender: user.name, message: data.message });

                    }

                });

            }

        });


    });

}