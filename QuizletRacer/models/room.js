const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const User = require('./user');

const rp = require('request-promise');
const cheerio = require('cheerio');

const stats = require('./../data');

var roomSchema = new Schema({

    code: String,
    link: String,

    terms: [{ term: String, definition: String }],

    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    active: Boolean,

    configuration: {

        alternative: Boolean,
        alternatives: Number,

        allTerms: Boolean,
        terms: Number

    }

});

roomSchema.methods.joinRoom = function (user, cb) {

    var room = this;

    if (room.active) return cb(false, 'Failed to join room');

    room.users.push(user._id);

    room.save(function (err, savedRoom) {

        if (err) {
            console.log(err.message);
            cb(false, err.message);
        }
        else {
            stats.userJoined();
            cb(true, 'Joined room');
        }

    });

}

roomSchema.methods.generateGameData = function (cb) {

    var room = this;

    var data = {

        terms: room.terms,
        alternatives: room.configuration.alternative

    }

    //var promise = new Promise(function (resolve, reject) {

    //    if (room.configuration.allTerms) {
    //        data.terms = room.terms;

    //        resolve();

    //    } else {

    //        for (var i = 0; i < room.configuration.terms; i++) {
    //            var term;

    //            while (true) {

    //                var index = Math.floor(Math.random() * Math.floor(room.terms.length - 1));

    //                term = room.terms[index];

    //                if (data.terms.includes(term)) {
    //                    break;
    //                }

    //            }

    //            data.terms.push(term);

    //            if (data.terms.length == i - 1) resolve();

    //        }

    //    }

    //});

    //promise.then(function () {

    //    cb(data);

    //});

    cb(data);

}

roomSchema.methods.tryStartRoom = function (cb) {

    var room = this;
    
    room.populate('users', function(err, populatedRoom){

        if (room.users.some(u => u.ready == false) == false) {

            if (room.active == false) {

                if (room.users.length > 1) {

                    room.active = true;

                    room.save(function (err, newRoom) {

                        console.log('Started room');

                        return cb(true);

                    });

                } else {
                    cb(false);
                }

            } else {

                cb(false)

            }

        } else {
            cb(false);
        }

    });

}

roomSchema.statics.leaveRoom = function (user, cb) {

    console.log('Trying to leave room');

    Room.findOne({ users: user._id }, function (err, room) {


        if (err) {
            console.log(err.message);
            cb({ message: 'Failed to find room' }, null);

        }else if (room == null) {

            cb({message: 'User is not in room'}, null)

        }else {

            Room.updateOne( room, { $pullAll: {users: [user._id] } }, function(err, newRoom){

                if (room.users.length - 1 == 0) {
                    Room.deleteOne({ code: room.code }, {}, function (err, affected) {

                        if (err) console.log(err.message);
                        else {
                            console.log('Removed room because no players');
                        }

                    });
                }

                cb(err, newRoom);

            });

        }
    });

}


roomSchema.statics.findRoom = function (code, cb) {
    Room.findOne({ code: code }).populate('users').exec(function (err, room) {

        if (err) console.log(err);
        else cb(err, room);

    });

}

roomSchema.statics.createRoom = function (link, alternative, alternatives, allTerms, terms, answerDefinitions, cb) {

    var configuration = {

        alternative: alternative,
        alternatives: alternatives,

        allTerms: allTerms,
        terms: terms

    };

    var code = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 7; i++) code += characters.charAt(Math.floor(Math.random() * characters.length));

    terms = []



    rp(link)
        .then(function (html) {

            var $ = cheerio.load(html);

            var term = {};


            $('.TermText').each(function (index) {

                if (index == 0 || index % 2 == 0) {
                    if (answerDefinitions == 'true') {
                        term['term'] = $(this).html();

                    } else {
                        term['definition'] = $(this).html();
                    }
                } else {
                    if (answerDefinitions == 'true') {
                        term['definition'] = $(this).html();

                    } else {
                        term['term'] = $(this).html();
                    }

                    terms.push(term);

                    term = {};

                }

            });

            if (terms.length == 0) {
                console.log('Invalid link, no terms');
                cb({ message: 'Invalid link' }, null);
                return;
            }

            var newRoom = new Room({

                code: code,
                link: link,

                terms: terms,
                users: [],

                active: false,

                configuration: configuration


            });
            stats.roomCreated();

            newRoom.save(cb);
            


        })
        .catch(function (err) {

            return cb(err, null);

        });
}

roomSchema.statics.clearRooms = function (cb) {

    Room.deleteMany({}, function (err, affected) {

        if (err) console.log(err);
        else console.log('Cleared rooms');
    });

}


var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
