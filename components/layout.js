import React, { Component } from 'react'
import Head from 'next/head'
import SearchForm from '../components/search-form'
import BeerResultsStack from '../components/beer-results-stack'

class Layout extends Component {
	state = {
		loaded: false,
		online: true,
		beersAsBasis: [],
		beerResults: [],
		localPosition: {},
		locationErrMsg: undefined,
		locationErrCode: 0
	}

	appendToBasisBeers = (beer) =>{
		let beersAsBasisCopy = [...this.state.beersAsBasis];
		beersAsBasisCopy.push(beer);
		this.setState({
			beersAsBasis: beersAsBasisCopy
		})
	}

	appendToBeerResults = (results) =>{
		this.setState({
			beerResults: results
		})
	}

	clearForm = () =>{
		this.setState({
			beerResults: [],
			beersAsBasis: [],
		})
	}

	conditionalOfflineMessage = () =>{
		if(this.state.online == false){
			return <div>
				<p>You are currently offline or have a very intermittent internet connection.</p>
				<p>Please retry accessing this application when you are connected to the internet or have a better internet connection.</p>
				<br/><br/>
			</div>
		}else if(this.state.beerResults.length > 0){
			return <BeerResultsStack clearForm={this.clearForm} beerResults={this.state.beerResults}/>
		}else if(this.state.locationErrMsg){
			return this.conditionalErrorMessage()
		}else{
			return <SearchForm appendToBeerResults={this.appendToBeerResults} appendToBasisBeers={this.appendToBasisBeers} {...this.state} />
		}
	}


	conditionalLocationInstructions = ()=>{
		if(this.state.locationErrCode == 1){
			return(<a target="new" href="https://www.lifewire.com/denying-access-to-your-location-4027789">
					Here are instructions for how to enable geolocation for your browser.
				</a>)
		}else if(this.state.locationErrCode == 1){
			return(<p>Please try another browser.</p>)
		}
	}

	conditionalErrorMessage = () =>{
		if(this.state.locationErrMsg){
			return <div>
				<p>{this.state.locationErrMsg}</p>
				{this.conditionalLocationInstructions()}
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
			this.forceUpdate();
		}, (err)=>{
			console.log(err)
			let errMsg;
			if(err.code == 1){
				errMsg = "Without your GPS, I can't provide local recommendations. Thanks for trying out this app!";
			}else if(err.code == 2){
				errMsg = "Geolocation services are currently unavailable with your current browser."
			}else{
				errMsg = "Your browser does not support geolocation; please use a browser that supports this functionality";
			}
			this.setState({
				locationErrMsg: errMsg,
				locationErrCode: err.code
			})
		})
	}

	setToOnline(){
		this.setState({loaded: true});
	}

	componentDidMount(){
		this.checkIfOnline();
	}

	render(){
		return (
			<div>
				<Head>
	        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
	        <title>Get Craft Beer</title>
	        <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet"/>	
					<link rel="stylesheet" type="text/css" href="/static/style.css"/>
	      </Head>
	      <div className="similar-beers">
					<h1>Get Craft Beer</h1>
					{this.checkIfLoaded()}
				</div>
			</div>
		)
	}
}
export default Layout