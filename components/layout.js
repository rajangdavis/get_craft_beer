import React, { Component } from 'react'
import SearchForm from '../components/search-form'

class Layout extends Component {
	state = {
		beersAsBasis: [],
		beerResults: [],
		localPosition: {},
		locationErrMsg: undefined
	}

	appendToBasisBeers = (beer) =>{
		this.state.beersAsBasis.push(beer)
		this.forceUpdate()
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

	componentDidMount(){
		this.getLocation()
	}

	render(){
		return (
			<div>
				<h1>Get Craft Beer</h1>
				{this.conditionalErrorMessage()}
				<SearchForm {...this.state} />
			</div>
		)
	}
}
export default Layout