import React, { Component } from 'react'
import Suggestions from './suggestions'
import fetch from 'isomorphic-unfetch'

// Inspired by:
// https://dev.to/sage911/how-to-write-a-search-component-with-suggestions-in-react-d20

class SearchInput extends Component {
	state = {
    query: '',
    results: []
  }

  getInfo = () => {
    fetch(`/beerNames?name=${this.state.query}`)
      .then(data => data.json())
      .then(json => {
        this.setState({
          results: json
        })
      })
  }


	handleInputChange = () => {
		if(this.search.value.length == 0 ){
			this.state.results = []
		}
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        if (this.state.query.length % 2 === 0) {
          this.getInfo()
        }
      }
    })
  }

	render() {
		return (
			<div>
				<input
				 placeholder="Search for..."
				 ref={input => this.search = input}
				 onChange={this.handleInputChange}
				/>
				<Suggestions results={this.state.results} />
			</div>
		)
	}
}

export default SearchInput