import React, { Component } from 'react'
import Option from '../components/option'
// Inspired by:
// https://dev.to/sage911/how-to-write-a-search-component-with-suggestions-in-react-d20

class Suggestions extends Component{
	state = {
		disabled: false,
		selectedBeer: undefined
	}
	
	setLocalBeerAndUpdateBeersBasis = (beer) =>{
		this.props.setLocalBeer(beer);
		this.props.appendMethod(beer);
		this.props.setToDisabled();
		this.setState({
			disabled: true,
			selectedBeer: beer
		})
	}
  
  render(){

  	if (this.state.disabled == true){
  		return(<p>{this.state.selectedBeer.name}</p>) 
  	}else if(this.props.isSearching == true){
  		return (<p><i>Searching</i></p>)
  	}else if(this.props.searchResults.length == 0 && this.props.searchQuery.length > 1 && this.props.isSearching == false){
  		return (<p><i>No results</i></p>) 
  	}else{
  		return(
  			<ul>{
	  		this.props.searchResults.map(result => (
	  			<Option key={result.id} beer={result} setLocalBeerAndUpdateBeersBasis={this.setLocalBeerAndUpdateBeersBasis} />
	  		))
	  		}</ul>
	  	)
  	}
  }
}

export default Suggestions