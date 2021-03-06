import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import Header from './header';
import Footer from './footer';
import BottomBanner from './bottom-banner';
import {Games} from './games';

export class gameGallery extends React.Component{
	constructor(props){
		super(props);
	}

	componentDidMount(){
		if(!localStorage.user_info){
			this.props.history.push('/');
			alert('You Must Be Logged In To Use Site	')
		}
		
		if(localStorage.user_info && !this.props.state.name){
			this.props.dispatch(actions.login(JSON.parse(localStorage.user_info)));
		}		
	}

	render(){
		return(

			<section className="game-gallery">
				<Header />
				<Games />
				<Footer />
			</section>
		)
	}
}

const mapToState = (state, props) => ({
	state: state
})

export default connect(mapToState)(gameGallery);