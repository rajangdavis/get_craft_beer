import React, { Component } from 'react'
import fetch from 'isomorphic-unfetch'

class SearchButton extends Component {

	state = {
		searching: false
	}

	searchForBeers = () =>{
		let ref = this;
		let jsonData = {
			selectedBeers: this.props.beersAsBasis,
			location: {
				latitude: this.props.localPosition.coords.latitude,
				longitude: this.props.localPosition.coords.longitude
			}
		}
		this.setState({
	  	searching: true
	  })
		fetch('reviewInfoFor',{
			method:"POST",
			body: JSON.stringify(jsonData),
			headers: {
		      'Accept': 'application/json',
		      'Content-Type': 'application/json'
		    },
		})
	    .then(data => data.json())
	    .then(json => {
	    	console.log(json);
	      ref.setState({
	      	searching: false
	      })
	      ref.props.appendToBeerResults(json)
	    })
	}

	isSearching = () =>{
		if(this.state.searching == true){
			return(<div className="loader"></div>)
		}
	}

	render(){
		return (
			<div>
			<button onClick={this.searchForBeers}>Find Beers</button>
			{this.isSearching()}
			</div>
		)
	}
}
export default SearchButton