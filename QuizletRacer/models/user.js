const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Room = require('./room');

var userSchema = new Schema({

    name: String,

    socketID: String,

    correct: Number,
    incorrect: Number,

    ready: Boolean

});

userSchema.methods.remove = function (cb) {

    var user = this;

    Room.leaveRoom(user, function (err, room) {

        if (err) {
            console.log(err.message);
            cb('Failed to leave room, will not delete user');
        }
        User.findOneAndDelete({ socketID: user.socketID}).exec(cb);
        
    });

}

userSchema.methods.toggleReady = function (cb) {

    var user = this;

    if (user.ready) {

        user.ready = false;

        user.save(function (err, user) {

            return cb(false);

        });

    } else {

        user.ready = true;

        user.save(function (err, user) {

            user.findRoom(function (err, room) {

                if (err) console.log(err.message);
                else {

                    room.tryStartRoom(function (started) {

                        if (started) {

                            cb(true)
                            return;
                        }

                    });

                }

            });

        });



    }

    cb(false);

}

userSchema.methods.findRoom = function (cb) {

    Room.findOne({ users: this._id }, cb);

}

userSchema.statics.initialize = function (socketID, username, cb) {

    var newUser = new User({

        name: username,
        socketID: socketID,

        correct: 0,
        incorrect: 0,

        ready: false

    });

    newUser.save(cb);

}

userSchema.statics.findUser = function (socketID, cb) {

    User.findOne({ socketID: socketID }, cb);

}


userSchema.statics.clearUsers = function () {

    User.deleteMany({}, function (err, affected) {

        if (err) console.log(err.message);
        else console.log('Cleared users');


    });

}


var User = mongoose.model('User', userSchema);

module.exports = User;
