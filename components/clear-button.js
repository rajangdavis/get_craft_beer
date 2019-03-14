import React, { Component } from 'react'

class ClearButton extends Component {

	render(){
		return (
			<div>
				<button className="clear" onClick={this.props.clearForm}>Clear Results</button>
			</div>
		)
	}
}
export default ClearButton