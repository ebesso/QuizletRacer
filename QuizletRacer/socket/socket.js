const User = require('../models/user');
const Room = require('../models/room');

exports = module.exports = function (io) {

    io.on('connection', function (socket) {

        const chat = require('./chat')(socket);
        const socketUsers = require('./user');
        const game = require('./game')(socket, io)

        socket.on('disconnect', function () {

            User.findUser(socket.id, function (err, user) {

                if (user != null) {
                    if (err) console.log(err.message);

                    user.findRoom(function (err, room) {

                        if (err) console.log(err.message);
                        else if (room == null) console.log('User is not connected to room');
                        else {
                            socket.leave(room.code);

                            io.to(room.code).emit('left-room', { name: user.name });
                            socketUsers.updateUsers(io, room.code);
                        }

                    });

                    console.log(`${user.name} disconnected`);

                    user.remove(function (err) {

                        if (err) console.log(err);
                        else console.log('Removed from room');

                    });
                }

            });
        });

        socket.on('initialize', function (data) {

            User.initialize(socket.id, data.name, function (err, newUser) {

                if (err) {
                    socket.emit('message', 'Failed to intialize user');
                    console.log(err.message);
                } else {
                    socket.emit('message', 'Successfully initialized user');

                    Room.findRoom(data.code, function (err, room) {

                        if (err) {
                            socket.emit('message', 'Failed to find room');
                            console.log(err);

                            newUser.remove(function (err) {

                                if (err) console.log(err.message);

                            })
                        } else {

                            room.joinRoom(newUser, function (success, message) {

                                if (success == false) {
                                    socket.emit('message', 'Failed to join room');
                                    console.log(message);
                                    newUser.remove(function (err) {

                                        if (err) console.log(err.message);
                                        socket.emit('leave');


                                    });
                                }
                                else {

                                    socket.emit('message', 'Joined room');
                                    socket.join(room.code);
                                    io.to(room.code).emit('joined-room', { name: newUser.name });
                                    socketUsers.updateUsers(io, room.code);


                                }


                            });

                        }


                    });
                }

            });
        });

    });

}