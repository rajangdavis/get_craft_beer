import React, { Component } from 'react'
import Link from 'next/link'
class Header extends Component{

	appendToBeersBasis = () =>{
		this.props.setLocalBeerAndUpdateBeersBasis(this.props.beer)
	}

	render(){
		return(
			<header>
				<Link href="/">
					<span className="header-links">
						<a>Home</a>
					</span>
				</Link>
				<Link href="/search">
					<span className="header-links">
					 	<a>Search Beers</a>
					 </span>
				</Link>
				<Link href="/about">
					<span className="header-links">
						<a>About</a>
					</span>
				</Link>
			</header>
		)
	}
}

export default Header