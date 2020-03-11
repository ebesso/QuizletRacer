const express = require('express');
const router = express.Router();

const data = require('./../data');

router.get('/contact', function (req, res) {

	res.render('contact');

});

router.post('/contact', function (req, res) {

	var message = req.body['message'];

	data.messageSent(message);

	console.log('Message sent');

	res.send('Message sent');

});

module.exports = router;