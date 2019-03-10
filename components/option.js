import React, { Component } from 'react'
class Option extends Component{

	appendToBeersBasis = () =>{
		this.props.setLocalBeerAndUpdateBeersBasis(this.props.beer)
	}

	render(){
		return(
			<li>
				<a href="#" onClick={this.appendToBeersBasis}>{this.props.beer.name}</a>
	    	</li>
		)
	}
}

export default Option