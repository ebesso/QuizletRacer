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

                    if (err) console.log(err.message);
                    if (room == null) console.log('Room not found');

                    if (newUser.correct == room.terms.length) {

                        var winner = newUser;

                        User.updateMany({ '_id': { '$in': room.users } }, { $set: { ready: false, correct: 0 } }, function (err, affected) {

                            if (err) console.log(err.message);

                            console.log('Resetted users ' + affected.length);

                            Room.updateOne(room, { active: false }, function (err) {

                                console.log('Resetted room');

                                io.in(room.code).emit('game-end', {

                                    'winner': winner,

                                });

                                socketUser.updateUsers(io, room.code);



                            });


                        });
                    }

                    socketUser.updateUsers(io, room.code);


                });


            });

        });

    });
}