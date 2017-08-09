import React from 'react';
import {Link} from 'react-router-dom';
import '../css/header.css';
import pisa from '../assets/pisa.png';

export default class Header extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			mobile: false
		}
		this.showMobile = this.showMobile.bind(this);
	}

	showMobile(){
		this.setState({
			mobile: !this.state.mobile
		})
		console.log(this.state.mobile)
	}
	

	render(){

		let mobileClass = this.state.mobile ? 'mobile-menu' : 'mobile-hidden';
		return(
			<header>
			  <nav>

			    <div className="mobile" onClick={this.showMobile}>
			    	<div className="line one"></div>
			    	<div className="line two"></div>
			    	<div className="line three"></div>
			    </div>
			    <div className={mobileClass}>
			    	<ul className="burger-ul">
			        <Link to="/"><li className="burger-item">Home</li></Link>
			        <Link to="/game-gallery"><li className="burger-item">Game Gallery</li></Link>
			        <Link to="/scoreboard"><li className="burger-item">My Scoreboard</li></Link>
			      </ul>
			    </div>

			    <div className="nav-item-wrapper">
			      <div className="logo-wrapper">
			        <div className="title"> GAME PIAZZA</div>
			        <div className="logo"></div>
			      </div>
			      <img className="pisa" src={pisa} alt="Game Piazza" />
			      
			      <ul className="nav-menu">
			        <Link to="/"><li className="nav-item">Home</li></Link>
			        <Link to="/game-gallery"><li className="nav-item">Game Gallery</li></Link>
			        <Link to="/scoreboard"><li className="nav-item">My Scoreboard</li></Link>
			      </ul>
			    </div>
			  </nav>
			</header>
		);
	}
}