const express = require('express');
const router = express.Router();

const rp = require('request-promise');
const cheerio = require('cheerio');

const Room = require('../models/room');

router.get('/create', function (req, res) {

	res.render('create_room');
	
});

router.post('/create', function (req, res) {

    Room.createRoom(req.body['quizlet-link'], req.body['alternatives'], req.body['number-of-alternatives'], req.body['all-terms'], req.body['number-of-terms'], function (err, newRoom) {

        if (err) console.log(`Failed to create room: ${err.message}`);
        else console.log('Successfully created room');

    });

});

router.post('/load_quizlet', function (req, res) {

    var terms = {}

    rp(req.body['quizlet-link'])
        .then(function (html) {

            var $ = cheerio.load(html);

            var last_key;

            var terms = {}

            $('.TermText').each(function (index) {

                if (index == 0 || index % 2 == 0) {
                    terms[$(this).html()] = null;
                    last_key = $(this).html();
                } else {

                    terms[last_key] = $(this).html();

                }

            });

            res.send({

                success: true,
                message: 'Quizlet loaded',
                terms: terms
            })

        })
        .catch(function (err) {

            res.send({
                success: false,
                message: 'Failed to load quizlet'
            });

        });



});

router.get('/connect/:code', function (req, res) {

    Room.findRoom(req.params.code, function (err, room) {

        if (err) res.send(err.message);
        else if (room == null) res.send('Could not find room');

        else res.render('join_room')

    });

});

router.post('/connect/:code', function (req, res) {

    Room.findRoom(req.params.code, function (err, room) {

        if (err) res.send(err.message);
        else if (room == null) res.send('Could not find room');

        else res.render('room', {name: req.body['username'], code: req.params.code});

    });

});

router.get('/connect', function (req, res) {

    res.render('connect');

});

module.exports = router;