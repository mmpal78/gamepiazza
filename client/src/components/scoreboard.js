import React from 'react';
import * as actions from '../actions';
import {connect} from 'react-redux';
import '../css/scoreboard.css';
import Score from './scores';
import Header from './header';
import Footer from './footer';

export class Scoreboard extends React.Component{
	constructor(props){
		super(props);
		this.setUserState = this.setUserState.bind(this);
		this.state = {
			results: ''
		}
	}

	setUserState(user){
		this.setState({
			name: user.name,
			email: user.email
		})
	}

	setResults(data){
		this.setState({
			results: data
		})
	}

	componentDidMount(){
	let footWrap = document.getElementsByClassName('footer-wrapper')[0];
	footWrap.style.height = '30px';
	footWrap.style.paddingBottom = '135px';
	window.addEventListener('scroll', function(){
		document.getElementsByClassName('footer-wrapper')[0].style.position = 'static'
	})
			
	if(!localStorage.user_info){
			this.props.history.push('/');
			alert('You Must Be Logged In To Use Site');
	} else {
		if(localStorage.user_info && !this.props.state.name){
				this.setUserState(JSON.parse(localStorage.user_info));
			}
			this.props.dispatch(actions.login(JSON.parse(localStorage.user_info)))
			
			let info = JSON.parse(localStorage.user_info)
			if(info.email === undefined){
				info.email = info.id;
			}
			try{
				let results = this.props.dispatch(actions.getScores(info.email));
				let that = this;	
				setTimeout(function(){
					try{
						that.setResults(that.props.state.user_scores.resp[0].stats);
					}
					catch(err){
						console.log(err);
					}
					
				}, 2000)
			}
			catch(err){
				console.log('There was an error.  Please re-login and try again');
			}
		}
	}

	render(){
		let scores = this.state.results ? this.state.results.map(function(val, ind){
			return <Score data={val} key={ind}/>
		}) : undefined;
		
		return(
			<div className="score-board-view">
				<Header />
				<table className="scores">
					<tbody>
					<tr>
						<td className="category">Date</td>
						<td className="category">Game</td>
						<td className="category">Score</td>
					</tr>
						{scores}
					</tbody>
				</table>
				<Footer />
			</div>
		)
	}
}

const mapToState = (state, props) => ({
	state: state
})

export default connect(mapToState)(Scoreboard);