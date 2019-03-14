import React, { Component } from 'react'
import Suggestions from './suggestions'
import fetch from 'isomorphic-unfetch'

// Inspired by:
// https://dev.to/sage911/how-to-write-a-search-component-with-suggestions-in-react-d20

class SearchInput extends Component {
	state = {
    query: '',
    searchResults: [],
    selectedBeer: '',
    searching: false,
    searchQueue: [],
    disabled: false
  }


  getInfo = (ref) => {

    let updatedSearchQueue = this.state.searchQueue.concat(this.state.query)
    
    this.setState({
      searching: true,
      searchQueue: updatedSearchQueue
    })
    fetch('beerNames',{
      method:"POST",
      body: JSON.stringify({query: this.state.query}),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
    })
    .then(data => data.json())
    .then(json => {

      let updatedSearchQueue = this.state.searchQueue.slice(1,this.state.searchQueue.length)  

      ref.setState({
        searchQueue: updatedSearchQueue,
        searchResults: json,
        searching: updatedSearchQueue.length == 0 ? false : true
      })
      ref.forceUpdate()
    })
    
  }

  setLocalBeer = (beerName) =>{
    this.state.selectedBeer = beerName
  }


	handleInputChange = () => {
		if(this.search.value.length == 0 ){
			this.state.searchResults = []
		}
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        if (this.state.query.length % 2 === 0) {
          this.getInfo(this)
        }
      }
    })
  }

  setToDisabled = () =>{
    this.setState({
      disabled: true
    })
  }

	render() {
		return (
			<div>
				<input
				 placeholder="Search for..."
				 ref={input => this.search = input}
				 onKeyUp={this.handleInputChange}
         disabled={this.state.disabled}
				/>
				<Suggestions 
          isSearching={this.state.searching}
          searchQuery={this.state.query}
          appendMethod={this.props.appendMethod} 
          searchResults={this.state.searchResults} 
          setLocalBeer={this.setLocalBeer}  
          setToDisabled={this.setToDisabled}
        />
			</div>
		)
	}
}

export default SearchInput