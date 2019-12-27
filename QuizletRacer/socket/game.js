const User = require('./../models/user');
const Room = require('./../models/room');

const socketUser = require('./user');

module.exports = function (socket, io) {

    socket.on('player-ready', function () {

        User.findUser(socket.id, function (err, user) {

            if (err) console.log(err.message);
            else {

                user.toggleReady(function (started) {

                    if (started) {

                       console.log(`Starting room...`);

                       user.findRoom(function (err, room) {

                           if (err) console.log(err.message);

                           else {

                               room.generateGameData(function (data) {

                                   if (room != null) {
                                       io.in(room.code).emit('game-start', data);
                                       socketUser.updateUsers(io, room.code)

                                   }

                               });

                           }

                       });

                    }


                    user.findRoom(function (err, room) {

                        socketUser.updateUsers(io, room.code)

                    });



                });

            }

        });

    });

    socket.on('player-answer', function () {

        User.findUser(socket.id, function (err, user) {

            console.log(user.name + ' has answered correctly');

            user.correct++;

            user.save(function (err, newUser) {

                newUser.findRoom(function (err, room) {

                    if (newUser.correct == room.terms.length - 1) {

                        console.log(user.name + ' has won the game');

                        io.in(room.code).emit('game-end', {

                            'winner': user,

                        });


                    }

                    socketUser.updateUsers(io, room.code);


                });


            });

        });

    });
}