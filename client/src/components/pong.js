import React from 'react';
import '../css/pong.css'
import * as actions from '../actions';
import {connect} from 'react-redux';
import CanvasMsg from './canvasMsg';
import Header from './header';

const io = require('socket.io-client');

export class Pong extends React.Component{
	constructor(props){
		super(props);
		
		this.state = {
			name: this.props.state.name,
			inplay: false,
			player: '',
			msg: '',
			showMsg: false,
			right_Score: 0,
			left_Score: 0,
			id: ''		
		}		
		this.setInPlay	= this.setInPlay.bind(this);
		this.setPlayer = this.setPlayer.bind(this);		
		this.setMsg = this.setMsg.bind(this);
		this.rightScore = this.rightScore.bind(this);
		this.leftScore = this.leftScore.bind(this);
		this.resetScore = this.resetScore.bind(this);
		this.setSocketId = this.setSocketId.bind(this);
		this.back = this.back.bind(this);
	}

	back(){
		this.props.history.push('/game-gallery');
	}

	setUserState(user){
		this.setState({
			name: user.name
		})
	}

	setSocketId(id){
		this.setState({
			id
		})
	}

	setInPlay(){
		this.setState({
			inplay: !this.state.inplay
		})		
	}

	stopInplay(){
		this.setState({
			inplay: false
		})
	}

	setPlayer(player){
		this.setState({
			player
		})
	}

	setLeftPlayer(player){
		this.setState({
			leftPlayer: player
		})
	}

	setRightPlayer(player){
		this.setState({
			rightPlayer: player
		})
	}

	rightScore(){	
		this.setState({
			right_Score: this.state.right_Score + 100
		})			
	}

	leftScore(){	
		this.setState({
			left_Score: this.state.left_Score + 100
		})			
	}

	resetScore(){
		this.setState({
			left_Score: 0,
			right_Score: 0
		})
	}

	setMsg(msg){
		this.setState({
			msg			
		})
	}

	setShowMsg(){
		this.setState({
			showMsg: !this.state.showMsg
		})
	}

	componentDidMount(){
	if(!localStorage.user_info){
			this.props.history.push('/');
			alert('You Must Be Logged In To Use Site	')
	}

	else {
		var hist;
	    var histFlag;
	      
	    histFlag = false;
	    hist = setInterval(function(){
	    if(window.location.href.indexOf('pong') >= 0){
	        histFlag = true;
	    }
	    else {
	      if(histFlag){
	      	socket.emit('leaving');
	      	clearInterval(hist);
	      }
	    }
	   }, 500)
	      


		if(localStorage.user_info && !this.props.state.name){
				this.setUserState(JSON.parse(localStorage.user_info));
		}
		this.props.dispatch(actions.login(JSON.parse(localStorage.user_info)));

		let timeOutArr = []; // hold all timeout values
		let that = this;
		
		let socket = io.connect('/pong');
		window.onpopstate = function(event) {  			
			socket.emit('leaving');
			socket.emit('disconnect');
		};	

		//Grab socket.io session ID
		const setId = () =>{
			if(!this.state.showMsg){
				this.setMsg('Connecting to Game...');
				this.setShowMsg();
			} else {
				console.warn('Connecting to Game...')
			}

			if(!this.state.id){
				try{
					if(socket.io.engine.id){
						this.setSocketId(`/pong#${socket.io.engine.id}`);
					}
				}
				catch(err){
					console.warn('Socket ID not set.  Will try again in 2 seconds');
				}
			setTimeout(setId, 2000);
			}
				
		    else {
			  announceState(this.state);
			  this.setShowMsg();
			}
		}

		setId();

		// Pong Game Code
		let frames = 30;  // To set frame rate of animation	

		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		let PADDLE_HEIGHT = canvas.height / 3;
		const PADDLE_WIDTH = 25;
		const WIN_SCORE = 500;

		window.addEventListener('resize', function(){
			resize();
		})

		resize();

		let vsComp = false;		// Toggle if user needs to play against computer
		let ballC = {}; 	// Ball coordinates to send over network
		
		// Create Ball
		let ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,		
			r: 10,	// Radius
			xs: 0,	// X Speed
			ys: 0,  // Y Speed
			c: '#fff',
			score: 0,		
			move: function(){
				this.x += this.xs;
				this.y += this.ys;
				
				
				if(this.x - this.r < lpaddle.w){
					if(this.y > lpaddle.y && this.y  < lpaddle.y + lpaddle.h){
						if(Math.abs(this.xs) >= 15 || Math.abs(this.ys) >= 15){
							rpaddle.h -= 3;
						} 
						
						this.xs = this.xs < 0 ? this.xs - .4 : this.xs + .4; 
						this.ys = this.ys < 0 ? this.ys - .4 : this.ys + .4;

						this.xs *= -1;
						this.ys *= -1;
	                    
	                    let deltaY = this.y; 
	                    -(lpaddle.y + PADDLE_HEIGHT / 2);
	                    this.ys = deltaY * 0.025; 
					}
					else {
						socket.emit('score', 'right');					
						this.reset();                 
						setTimeout(checkWin, 200)         
					}
				}
				else if(this.x + this.r > canvas.width - rpaddle.w){
					if(this.y > rpaddle.y && this.y < rpaddle.y + rpaddle.h){
						if(Math.abs(this.xs) >= 15 || Math.abs(this.ys) >= 15){
							lpaddle.h -= 3;
						} 
						
						this.xs = this.xs < 0 ? this.xs - .4 : this.xs + .4; 
						this.ys = this.ys < 0 ? this.ys - .4 : this.ys + .4;
						this.xs *= -1;
						this.ys *= -1;
	                    
	                    let deltaY = this.y; 
	                    -(rpaddle.y + PADDLE_HEIGHT / 2);
	                    this.ys = deltaY * 0.025;                    
					}
					else {
						socket.emit('score', 'left');									
	                    this.reset();                
	                    setTimeout(checkWin, 200)                       
					}
				}
				(this.y + this.r >= canvas.height || this.y - this.r <= 0) ? this.ys *= -1 : this.y = this.y;
				ballC.x = this.x;
				ballC.y = this.y;
				if(that.state.player){
					socket.emit('ball', ballC);
				}
				
			},
			draw: function(){
				ctx.fillStyle = this.c;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
				ctx.fill();	
			},
			reset: function(){
				this.x = canvas.width / 2;
				this.y = canvas.height / 2;
			}
		}

		// Create Left / Right Paddles
		let lpaddle = {		
			x: 1,
			y: canvas.height / 2 - PADDLE_HEIGHT / 2,
			h: PADDLE_HEIGHT,
			w: PADDLE_WIDTH,
			score: 0,
			move: function(x, y){
				this.x = x;
				this.y = y;
			},
			draw: function(){
				ctx.fillStyle = '#fff';
				ctx.fillRect(this.x, this.y, this.w, this.h);
			}		
		}

		let rpaddle = {		
			x: canvas.width - PADDLE_WIDTH - 1,
			y: canvas.height / 2 - PADDLE_HEIGHT / 2,
			h: PADDLE_HEIGHT,
			w: PADDLE_WIDTH,
			score: 0,
			move: function(x, y){
				this.x = x;
				this.y = y;
			},
			draw: function(){
				ctx.fillStyle = '#fff';
				ctx.fillRect(this.x, this.y, this.w, this.h);
			}		
		}

		// Align mouse movements with paddle
		function calcMousePos(e){
			let rect = canvas.getBoundingClientRect();
			let root = document.documentElement;
			let mouseX = e.clientX - rect.left - root.scrollLeft;
			let mouseY = e.clientY - rect.top - root.scrollTop;
			return {
				x: mouseX,
				y: mouseY
			}
		}


		// Update Game State
		function update(){		
			if(vsComp){
				computerMovement();
				ball.move();
			}
			if(that.state.player){
				ball.move();			
			}		
		}

		// Render Functions
		function draw(){	
			clr();		
			ctx.fillStyle = '#45CDFF';
			ctx.fillRect(0, 0, canvas.width, canvas.height);		
			ball.draw();
			lpaddle.draw();
			rpaddle.draw();	
			
		}

		// Clear Screen
		function clr(){
			ctx.fillStyle = '#45CDFF';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		// Start Game Animation
		function start() {						
				setInterval(function(){			
					update();			
					draw();
				}, 1000/frames);
		}

		// Set Initial Ball Speed
		function beginBall(){
			ball.xs = -10;
			ball.ys = 6;
		}

		// Resize Paddles on Window Resize
		function resize(){
			if(window.innerWidth <= 650){
				if(that.state.player){
					canvas.removeEventListener('mousemove', getRightMouse);
					canvas.addEventListener('mousemove', getRightMouse);

				} else {
					canvas.removeEventListener('mousemove', getLeftMouse);	
					canvas.addEventListener('mousemove', getLeftMouse);
				}
			}
		}

		// Reset Game & Scores
		
		function resetBall(){
			ball.xs = 0;
			ball.ys = 0;
			ball.reset();
		}
		
		function resetGame(){
			let obj = saveScore();	
			that.props.dispatch(actions.saveScore(obj));
			resetBall();
			that.setInPlay();
			
			let playerList = document.getElementsByClassName('player-list')[0];
			let leftPlayer = playerList.children[0].innerHTML;
			if(playerList.children[1]){
				var rightPlayer = playerList.children[1].innerHTML;
			} else {
				rightPlayer = 'Computer';
			}
			vsComp = false;
			timeMsg(`${leftPlayer}: ${that.state.left_Score}, ${rightPlayer}: ${that.state.right_Score}`, 5000, ['findLoser']);		
			that.resetScore();	
			
			
			
		}

		// Reset Game
		const resetVsComp = () => {	
			let obj = saveScore();	
			that.props.dispatch(actions.saveScore(obj));	
			resetBall();				
			that.setInPlay();
			let playerList = document.getElementsByClassName('player-list')[0];
			let leftPlayer = playerList.children[0].innerHTML;
			if(playerList.children[1]){
				var rightPlayer = playerList.children[1].innerHTML;
			} else {
				rightPlayer = 'Computer';
			}
			vsComp = false;
			timeMsg(`${leftPlayer}: ${that.state.left_Score}, ${rightPlayer}: ${that.state.right_Score}`, 5000, ['announce']);
			that.resetScore();				
		}

		const initializeGame = () => {		
			resetBall();
			that.resetScore();		
		}

	const findLoser = () => {
		let loser = (that.state.right_Score > that.state.left_Score) ? 1 : 0;
		return loser;
	}


		// Check for win
		function checkWin(){		
			if(that.state.right_Score >= WIN_SCORE || that.state.left_Score >= WIN_SCORE){			
				if(vsComp){
					resetVsComp();				
				}
				else {
					socket.emit('reset');
				}
			}
		}

		function saveScore(){

			let score = (that.state.player) ? that.state.right_Score : that.state.left_Score;
			
			let local = JSON.parse(localStorage.user_info);
			if(local.email === undefined){
				local.email = local.id;
			}
			let obj = {
				email: local.email,
				name: local.name,
				game: 'pong',
				score: score
			}
			return obj;
		}

		// Game AI			
		function computerMovement(){        
		    if(rpaddle.y + PADDLE_HEIGHT / 2 < ball.y - 35){            
		        rpaddle.y += 10;    
		    } else if(rpaddle.y + PADDLE_HEIGHT / 2 > ball.y + 35){
		        rpaddle.y += -10;
		    }	    
		}	

		// Begin Animation
		start() 

		function announceState(state){	
			socket.emit('state', state);
		}
		
		// Receiv PlayersList from Server
		socket.on('list', (list) => {
			if(this.inplay){
				this.setInPlay();
			} 
			that.stopInplay()
			vsComp = false;
			resetBall();
			that.resetScore();

			if(window.location.href.indexOf('pong') >= 0){
				let playerList = document.getElementsByClassName('player-list')[0];
				playerList.innerHTML = '';

				// Append Players List on Clients
				list.forEach(function(val, ind){
					let p = document.createElement('p');
					p.innerHTML  = val.name;
					playerList.appendChild(p)
				});
			
				// Set First 2 Players in List as Opponents
				try{
					if(this.state.inplay === false && playerList.querySelectorAll('p')[0].innerHTML === this.state.name){						
						choosePlayerSide(0);					
					}
					if(this.state.inplay === false && playerList.querySelectorAll('p')[1].innerHTML === this.state.name){			
						choosePlayerSide(1);						
					} 	

					if(document.getElementsByClassName('player-list')[0].children.length === 1 && this.state.inplay){
							resetBall();
							timeMsg('Waiting For 2nd Player', 99999999);
					} 	
				}
				catch(err){
					console.log(err);
				}
			}
	})

		function getLeftMouse(e){
					let mousePos = calcMousePos(e);
					lpaddle.y = mousePos.y - PADDLE_HEIGHT / 2;
					socket.emit('mousePos', mousePos);				
			}

		function getRightMouse(e){
				let mousePos = calcMousePos(e);	
				if(canvas.width >= 550){		
					rpaddle.y = mousePos.y;
				} else {
					rpaddle.y = mousePos.y;
				}
				socket.emit('mousePos', mousePos);				
		}
		
		//  Assign Right / Left Paddle to players and track mouse movements
		const choosePlayerSide = (player) =>{

		 	if(player === 0){	 			 	
		 		this.setPlayer(0);
		 		// Reset Event Listeners
		 		canvas.removeEventListener('mousemove', getLeftMouse);
		 		canvas.removeEventListener('mousemove', getRightMouse);

				canvas.addEventListener('mousemove', getLeftMouse);
				
				this.setInPlay();
		  	}
		  	else if(player === 1){
		 		this.setPlayer(1);

		 		canvas.removeEventListener('mousemove', getLeftMouse);
		 		canvas.removeEventListener('mousemove', getRightMouse);

				canvas.addEventListener('mousemove', getRightMouse);
				
				 		
		 		this.setInPlay();
		 		socket.emit('newplayer');
			}		
		}

		window.addEventListener('resize', function(){
			resize();
		})

		resize();


	//  Set & Show Messages On All Players Screens
		const timeMsg = (msg, mili, funcs)=>{
			if(that.state.showMsg){
				that.setShowMsg();
			}
			this.setMsg(msg);
			this.setShowMsg();			
			timeOutArr.push(setTimeout(function(){
				this.setShowMsg();				
				if(funcs){
					funcs.forEach(function(val){
						switch(val){
							case 'begin':
							resetBall();
							beginBall();
							break;

							case 'announce':
							announceState(that.state);
							break;

							case 'findLoser':
							let loser = findLoser();
							that.resetScore();
							if(loser === that.state.player){			
								announceState(that.state);
							}
							break;

							default:
							console.log("DEFAULT");
						}
					})
				}
			}.bind(this), mili));
		}



		socket.on('mousePos', (data)=>{	
			if(this.state.player === 0){
				rpaddle.y = data.y - PADDLE_HEIGHT / 2;
			}
			else if(this.state.player === 1){
				lpaddle.y = data.y - PADDLE_HEIGHT / 2;
			}
		})

		socket.on('ball', function(data){	
			ball.x = data.x;
			ball.y = data.y;
		})

		socket.on('newplayer', () => {		
			initializeGame();
			timeOutArr.forEach(function(val){
				clearTimeout(val);			
			})
			if(that.state.showMsg){
				that.setShowMsg();
			}
			resetBall();
			timeMsg('NEW GAME', 2000, ['begin']);
		})

		socket.on('message', (msg, name) => {	
			document.getElementById('message-inp').value = '';
			let messages = document.getElementsByClassName('message');	
			if(messages.length >= 10){
				messages[0].remove();
			}	
						
			document.getElementById('msg').innerHTML += `<p class="message"><span class="message-name">${name}:</span> ${msg}</p>`;
		})

		socket.on('score', (side) => {		
			if(side === 'right'){
				this.rightScore();
			}
			else{
				this.leftScore();
			}
		})

		socket.on('reset', () => {
			resetGame();
		})

		postMessage = () => {			
			let msg = document.getElementById('message-inp').value;						
			socket.emit('message', msg, this.state.name);	
		}	
	}
}

	
	render(){
		if(document.getElementsByClassName('player-list')[0]){
			let list = document.getElementsByClassName('player-list')[0];
			if(list.children.length === 1){
				var left_Player = list.children[0].innerHTML;
				var right_Player = 'Computer'
			}
			else if(list.children.length >= 2){
				left_Player = list.children[0].innerHTML;
				right_Player = list.children[1].innerHTML;
			}			
		}
		
		let msg = (this.state.showMsg) ? <CanvasMsg msg={this.state.msg}/> : undefined;		
		return(	
			<div>
				<Header />
				<div className="canvas-container">
					{msg}

					<canvas 
						width="600" 
						height="400" 
						id="canvas"  
						ref={(canvas) => { this.canvasRef = canvas; }}>
					</canvas>
				</div>
					<div className="score-board">
						<div className="left-score">
							<p id="score">{left_Player} <span className="left num">{this.state.left_Score}</span></p>
						</div>
						<div className="right-score">
							<p id="score">{right_Player} <span className="right num">{this.state.right_Score}</span></p>
						</div>
					</div>	
					<div className="player-info-container">
						<div className="player-list-wrapper">
							<p>Players in Room</p>
							<div className="player-list"></div>
						</div>
						<div className="message-wrapper">
							<p>Message Board</p>
							<input id='message-inp' />				
							<button id="message-btn" onClick={postMessage}>Submit</button>
							<div id="msg"></div>
						</div>
					</div>	
				</div>
		)						
	}
}



const mapToState = (state, props) => ({
	state: state
})

export default connect(mapToState)(Pong);