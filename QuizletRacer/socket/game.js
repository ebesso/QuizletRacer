const User = require('./../models/user');
const Room = require('./../models/room');

const socketUser = require('./user');

module.exports = function (socket, io) {

    socket.on('player-ready', function () {

        User.findUser(socket.id, function (err, user) {

            if (err) console.log(err.message);
            else {

                user.toggleReady(function (started) {

                    //if (started) {

                    //    console.log(`Starting room...`);

                    //    user.findRoom(function (err, room) {

                    //        if (err) console.log(err.message);

                    //        else {

                    //            room.generateGameData(function (data) {

                    //                socket.emit('game-start', data);

                    //            });

                    //        }

                    //    });

                    //}


                    user.findRoom(function (err, room) {

                        socketUser.updateUsers(io, room.code)

                    });



                });

            }

        });

    });
}