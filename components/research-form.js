import React, { Component } from 'react'
import SearchInput from '../components/search-input'
import SearchButton from '../components/search-button'

class ResearchForm extends Component {

	render(){
		return (
			<div id="search-input-container">
				<h2>Search for American craft beer</h2>
				<SearchInput {...this.props}/>
			</div>
		)
	}
}
export default ResearchForm