import React, { Component } from 'react'
import SearchInput from '../components/search-input'
import SearchButton from '../components/search-button'

class SearchForm extends Component {

	appendToBasisBeers = (beer) =>{
		this.props.beersAsBasis.push(beer)
		this.forceUpdate()
	}

	conditionalSearchInput = (lengthToCheck) =>{
		if(this.props.beersAsBasis.length >= lengthToCheck){
			return <SearchInput appendMethod={this.appendToBasisBeers}/>
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
				<SearchInput appendMethod={this.appendToBasisBeers}/>
				{this.conditionalSearchInput(1)}
				{this.conditionalSearchInput(2)}
				{this.conditionalSearchButton()}
			</div>
		)
	}
}
export default SearchForm