import React, { Component } from 'react'
import SearchInput from '../components/search-input'
import SearchButton from '../components/search-button'

class SearchForm extends Component {

	conditionalSearchInput = (lengthToCheck) =>{
		if(this.props.beersAsBasis.length >= lengthToCheck){
			return <SearchInput {...this.props}/>
		}
	}

	conditionalSearchButton = () =>{
		if(this.props.beersAsBasis.length >= 1){
			return <SearchButton {...this.props} />
		}
	}

	render(){
		return (
			<div id="search-input-container">
				<h2>Please choose 1 - 3 beers to compare against beers in your local area</h2>
				<SearchInput {...this.props}/>
				{this.conditionalSearchInput(1)}
				{this.conditionalSearchInput(2)}
				<br/>
				{this.conditionalSearchButton()}
			</div>
		)
	}
}
export default SearchForm