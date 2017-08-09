
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {PORT, DATABASE_URL} = require('./config');
const socket = require('socket.io');
const scoreRouter = require('./routes/scoreRouter');
const validateRouter = require('./routes/validateRouter');



const app = express();
//const server = app.listen(3001);

mongoose.Promise = global.Promise;
console.log('Server Running');

let playersList = [];

app.use(express.static('static'));
app.use(morgan('common'));
app.use(bodyParser.json());

app.use('/score', scoreRouter.router);
app.use('/validate', validateRouter.router);

function startSocketIO(){
	const io = socket(server);
	let nsp = io.of('/pong');

	nsp.on('connection', function(socket){
	console.log('New socker id: ' + socket.id);

		socket.on('mouse', function(coor){	
			socket.emit('mouse', coor)
		});

		socket.on('state', function(data){
		
			// let index = playersList.indexOf(data.name);
			// console.log(`IndexOf: ${index}, Name: ${data.name}`);
			// if(index >= 0){
			// 	playersList.splice(index, 1);
			// 	console.log(`Splicing: ${playersList[index]}`);
			// }
			
			playersList.forEach(function(elem, ind){
				if(elem.name === data.name){
					playersList.splice(playersList[ind], 1);
					console.log('Splicing: ', playersList[ind]);
				}
			})

			let user = {name: data.name, id: data.id};
			if(data.name){
				playersList.push(user);
				console.log('New PlayersList: ', playersList);	
			}
			
			nsp.emit('list', playersList)
			//io.sockets.emit('list', playersList)
		})

		socket.on('mousePos', function(data){
			socket.broadcast.emit('mousePos', data);
		})

		socket.on('ball', function(data){
			socket.broadcast.emit('ball', data);
		})

		socket.on('challenge', function(){
			nsp.emit('challenge');
			//socket.emit('challenge');
		})

		socket.on('test', function(data){
			nsp.emit('test', data);
			//io.sockets.emit('test', data);
		})

		socket.on('newplayer', () => {
			nsp.emit('newplayer');
			//io.sockets.emit('newplayer');
		})

		socket.on('message', function(msg, name){
			nsp.emit('message', msg, name);
			//io.sockets.emit('message', msg, name);
		})

		socket.on('score', (side) => {
			nsp.emit('score', side);
			//io.sockets.emit('score', side);
		})

		socket.on('reset', () => {
			nsp.emit('reset');
			//io.sockets.emit('reset');
		})

		socket.on('disconnect', () => {
			console.log('DISCONNECTING');
			console.log(socket.id);
			console.log('Player List before Disconnect: ', playersList)
			playersList.forEach(function(elem, ind){
				if(elem.id === socket.id){
					playersList.splice(ind, 1);
				}
			})

			nsp.emit('list', playersList)
			console.log('List after Disconnect: ', playersList);
		})

		socket.on('leaving', () => {
			console.log('LEAVING');
			console.log(socket.id);
			console.log('Player List before Disconnect: ', playersList)
			playersList.forEach(function(elem, ind){
				if(elem.id === socket.id){
					playersList.splice(ind, 1);
				}
			})

			nsp.emit('list', playersList)
			console.log('List after Disconnect: ', playersList);
		})

//io.sockets.on('connection', newConnection);
let nsp = io.of('/pong');
nsp.on('connection', function(socket){
	newConnection(socket);
})


let playersList = [];

function newConnection(socket){
	console.log('New socker id: ' + socket.id);

	socket.on('mouse', function(coor){		
		socket.broadcast.to('/pong').emit('mouse', coor)
	});

	socket.on('state', function(data){
	
		let index = playersList.indexOf(data.name);
		console.log(`IndexOf: ${index}, Name: ${data.name}`);
		if(index >= 0){
			playersList.splice(index, 1);
			console.log(`Splicing: ${playersList[index]}`);
		}
		if(data.name){
			playersList.push(data.name);
			console.log('New PlayersList: ', playersList);	
		}
		
		
		nsp.emit('list', playersList)
	})

	socket.on('mousePos', function(data){
		socket.broadcast.to('/pong').emit('mousePos', data);
	})

	socket.on('ball', function(data){
		socket.broadcast.to('/pong').emit('ball', data);
	})

	socket.on('challenge', function(){
		nsp.emit('challenge');
	})

	socket.on('test', function(data){
		nsp.emit('test', data);
	})

	socket.on('newplayer', () => {
		nsp.emit('newplayer');
	})

	socket.on('message', function(msg, name){
		nsp.emit('message', msg, name);
	})

	socket.on('score', (side) => {
		nsp.emit('score', side);
	})

	socket.on('reset', () => {
		nsp.emit('reset');



function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });

}


if (require.main === module) {
  runServer().catch(err => console.error(err));
};



module.exports = {runServer, closeServer, app};








