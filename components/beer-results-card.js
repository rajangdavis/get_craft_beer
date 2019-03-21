import React, { Component } from 'react'
import BeerFlavorWheel from '../components/beer-flavor-wheel'
import Link from 'next/link'

class BeerResultsCard extends Component {

	render(){
		let beerName = this.props.resultData.name;

		let matchedBeers = this.props.resultData.matchedBeers.map(beer=>{
			
			let mapsDirections = `https://www.google.com/maps/dir/`;
			mapsDirections += `${this.props.location.coords.latitude},${this.props.location.coords.longitude}/`
			mapsDirections += [`${beer.brewery_name},`,`${beer.brewery_address},`,`${beer.brewery_city},`,beer.brewery_state, beer.brewery_zipcode].join("+")
			
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
								<strong>Address</strong>:
								<Link href={mapsDirections}>
								<a target="_blank">
									{beer.brewery_address}<br/>
									{beer.brewery_city}, {beer.brewery_state} {beer.brewery_zipcode}
								</a>
								</Link>
							</span>
						</li>
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
								{beer.abv ? `${beer.abv}%` : "Unknown" }
							</span>
						</li>
						<li>
							<span>
								<strong>Style</strong>:
								{beer.style}
							</span>
						</li>

						<li>
							<BeerFlavorWheel id={beer.id} svgData={beer.beer_flavor_wheel_svg_data} />
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