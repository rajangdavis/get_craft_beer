import React, { Component } from 'react'
import SearchForm from '../components/search-form'

class Layout extends Component {
	state = {
		loaded: false,
		online: true,
		beersAsBasis: [],
		beerResults: [],
		localPosition: {},
		locationErrMsg: undefined
	}

	appendToBasisBeers = (beer) =>{
		this.state.beersAsBasis.push(beer)
		this.forceUpdate()
	}

	conditionalOfflineMessage = () =>{
		if(this.state.online == false){
			return <div>
				<p>You are currently offline or have a very intermittent internet connections.</p>
				<p>Please retry accessing this application when you have a better internet connection.</p>
				<br/><br/>
			</div>
		}else{
			return <SearchForm {...this.state} />
		}
	}


	conditionalErrorMessage = () =>{
		if(this.state.locationErrMsg){
			return <div>
				<p>{this.state.locationErrMsg}</p>
				<a target="new" href="https://www.lifewire.com/denying-access-to-your-location-4027789">
					Here are instructions for how to enable geolocation for your browser.
				</a>
				<br/><br/>
			</div>
		}
	}


	checkIfLoaded = () =>{
		if(this.state.loaded == false){
			return(
				<p>Still Loading... please wait</p>
			)
		}else{
			return(
				this.conditionalErrorMessage(),
				this.conditionalOfflineMessage()
			)
		}
	}

	checkIfOnline = () =>{
		this.getLocation();
		this.setToOnline();
		let ref = this;
		function updateOnlineStatus(event) {
			ref.setState({
				online: navigator.onLine,
			})
		}
		window.addEventListener('online',  updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);
	}

	getLocation = () =>{
		navigator.geolocation.getCurrentPosition((position)=>{
			this.setState({
				localPosition: position
			})
		}, (err)=>{
			let errMsg;
			if(err.code == 1){
				errMsg = "Without your GPS, I can't provide local recommendations. Thanks for trying out this app!";
			}else{
				errMsg = "Your browser does not support geolocation; please user a browser that supports this functionality";
			}
			this.setState({
				locationErrMsg: errMsg 
			})
			this.forceUpdate()
		})
	}

	setToOnline(){
		this.setState({loaded: true});
		this.forceUpdate();
	}

	componentDidMount(){
		this.checkIfOnline();
	}

	render(){
		return (
			<div>
				<h1>Get Craft Beer</h1>
				{this.checkIfLoaded()}
			</div>
		)
	}
}
export default Layout