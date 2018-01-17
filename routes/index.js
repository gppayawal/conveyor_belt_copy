var express = require('express');
var router = express.Router();
var socket = require('socket.io-client')('https://conveyor-belt-controller.herokuapp.com');

//restrict access to pages that requires log in
function restrict(req,res, next){
	console.log(req.session.user);
	if (req.session.user) {
    	next();
  	} else {
    	res.redirect('/');
  	}
}

socket.on('disconnected_controller', function(i){

});

router.get('/', function(req, res, next) {
	if(req.session.user)
		res.redirect('home');
	else
		res.sendFile('index.html', { root: __dirname + '/../src/'} );
});

router.get('/header', function(req, res, next) {
	res.sendFile('header.html', { root: __dirname + '/../src/'} );
});

router.get('/home', restrict, function(req, res, next){
	if(req.session.user.controller)
		res.redirect('operation');
	else
		res.sendFile('home.html', { root: __dirname + '/../src/'} );
});

router.get('/operation', restrict, function(req, res, next){
	if(req.session.user.controller)
		res.sendFile('operation.html', { root: __dirname + '/../src/'});
	else{
		res.redirect('home');
	}
});

router.get('/continuous_run', restrict, function(req, res, next){
	res.sendFile('continuous_run.html', { root: __dirname + '/../src/'});
});

router.get('/jogging', restrict, function(req, res, next){
	res.sendFile('jogging.html', { root: __dirname + '/../src/'} );
});

router.get('/change_password', restrict, function(req, res, next){
	res.sendFile('change_password.html', { root: __dirname + '/../src/'} );
});

router.post('/logs', restrict, function(req, res, next){
	var body = {};
	body.id = req.body.id;

	console.log(body);
	socket.emit('get_logs', body, function(result){
		if(result.status == 500){
			delete req.session.user.controller;
			res.redirect('/home');
		} else if(result.status == 200);
			res.json(result);
	});
});

router.post('/select', restrict, function(req, res, next){
	var body = {};
	body.id = req.body.id;
	body.username = req.session.user.username;
	
	socket.emit('select', body, function(result){
		if(result.status == 500){
			delete req.session.user.controller;
			res.redirect('/home');
		}
		else {
			if(result.status == 200)
				req.session.user.controller = req.body.id;
			res.json(result);
		}
	});
});

router.post('/deselect', restrict, function(req,res, next){
	var body = {};
	body.i = req.session.user.controller;
	body.username = req.session.user.username;

	socket.emit('deselect', body, function(result){
		delete req.session.user.controller;
		res.redirect('/home');
	});
});

router.post('/send', restrict, function(req,res, next){
	var body = {};
	body.i = req.session.user.controller;
	body.username = req.session.user.username;
	body.control = req.body.control;

	socket.emit('control', body, function(result){
		if(result.status == 500) {
			delete req.session.user.controller;
			res.redirect('/home');
		} else
			res.json(result);
	});
});

router.get('/controllerStatus', restrict, function(req, res, next){
	var body = {};
	body.i = req.session.user.controller;
	socket.emit('status', body, function(result){
		if(result.status == 500) {
			delete req.session.user.controller;
			res.redirect('/home');
		} else
			res.json(result);
	});
});

router.get('/list', restrict, function(req,res, next){
	socket.emit('length', function(result){
		res.status(200).json(result);
	});
});


module.exports = router;
