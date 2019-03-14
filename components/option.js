import React, { Component } from 'react'
class Option extends Component{

	appendToBeersBasis = () =>{
		this.props.setLocalBeerAndUpdateBeersBasis(this.props.beer)
	}

	render(){
		return(
			<li>
				<a href="javascript:void(0)" role="link" tabIndex="0" onClick={this.appendToBeersBasis}>{this.props.beer.name}</a>
	    	</li>
		)
	}
}

export default Option