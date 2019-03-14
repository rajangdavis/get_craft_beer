import React, { Component } from 'react'
import ClearButton from '../components/clear-button'
import BeerResultsCard from '../components/beer-results-card'

class BeerResultsStack extends Component {
	render(){
		let beerResults = this.props.beerResults.map(result =>{
			return (<BeerResultsCard key={result.id} resultData={result}/>)
		})

		return (
			<div id="search-input-container">
				<div className="results">
					{beerResults}
				</div>
				<ClearButton {...this.props}/>
			</div>
		)
	}
}
export default BeerResultsStack