const Room = require('./../models/room');

function updateUsers(io, code) {

    var users = {

        users: []

    };

    Room.findRoom(code, function (err, room) {

        if (err) console.log(err.message);
        if (room == null) console.log('Room does not exist');
        else {

            var promise = new Promise(function (resolve, reject) {


                for (var i = 0; i < room.users.length; i++) {

                    var user = room.users[i];

                    users.users.push({

                        name: user.name,
                        ready: user.ready,
                        correct: user.correct,
                        incorrect: user.incorrect

                    });

                    if (room.users.length - 1 == i) resolve();

                }

            });
            promise.then(function () {

                io.in(room.code).emit('update-users', users);

            });


        }

    });



        


}

module.exports.updateUsers = updateUsers;