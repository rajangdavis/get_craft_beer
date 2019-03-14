import React, { Component } from 'react'
import Link from 'next/link'

class BeerResultsCard extends Component {


	render(){
		let beerName = this.props.resultData.name;

		let matchedBeers = this.props.resultData.matchedBeers.map(beer=>{
			return <li key={beer.beer_id}>
				<div>
					<h3>
						<Link href={beer.link}>
							<a target="_blank">{beer.brewery_name} - {beer.beer_name}</a>
						</Link>
					</h3>
					<ul>
						<li>
							<span>
								<strong>Distance</strong>:
								{beer.distance.toFixed(3)} miles
							</span>
						</li>
						<li>
							<span>
								<strong>Beer availability</strong>:
								{beer.beer_availability && beer.beer_availability.length > 3 ? beer.beer_availability : 'Unknown'}
							</span>
						</li>
						<li>
							<span>
								<strong>Alcohol by volume</strong>:
								{beer.abv && beer.abv.length > 3 ? beer.abv : 'Unknown'}
							</span>
						</li>
						<li>
							<span>
								<strong>Style</strong>:
								{beer.style}
							</span>
						</li>
					</ul>
				</div>
			</li>
		})
		return (
			<div  className="fadeIn result-info">
				<h2>Recommendations for {beerName}</h2>
				<ul>
					{matchedBeers}
				</ul>	
			</div>
		)
	}
}
export default BeerResultsCard