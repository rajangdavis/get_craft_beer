import React, { Component } from 'react'
import fetch from 'isomorphic-unfetch'

class SearchButton extends Component {

	searchForBeers = () =>{
		let jsonData = {
			selectedBeers: this.props.beersAsBasis,
			location: {
				latitude: this.props.localPosition.coords.latitude,
				longitude: this.props.localPosition.coords.longitude
			}
		}

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
      console.log(json)
    })
	}

	render(){
		return (
			<button onClick={this.searchForBeers}>Search</button>
		)
	}
}
export default SearchButton