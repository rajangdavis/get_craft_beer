const {sequelize} = require("./models/index.js")

module.exports = {

	reviewInfoFor: async (jsonData)=>{

		try{
			let localResults = await _localBeerDictionaries(jsonData.location);

			let reviewInfo = 
			`SELECT 
			beers.id as beer_id,
			beers.name as beer_name,
			beers.review_text_json
			FROM beers
			WHERE beers.id IN (:beer_ids)
			GROUP BY beers.id, beer_name;`
			let selectedBeers =  await sequelize.query(
				reviewInfo,
				{ replacements: { 
					beer_ids: jsonData.selectedBeers.map(b => parseInt(b.id))
				}, type: sequelize.QueryTypes.SELECT })

			// return _cosineSimularities(selectedBeers, localResults);
			return {'selectedBeers': selectedBeers, 'localResults': localResults};
		
		}catch(err){
			return err
		}
	},

}



const _coordsQuery = (location) => {
	let lat = parseFloat(location.latitude)
	let long = parseFloat(location.longitude)

	return `
	SELECT ST_Distance(
	    ST_GeomFromText('POINT(${lat} ${long})', 4326),
	    ST_GeomFromText(ST_AsText(position), 4326)
	) * 57.884 AS distance,
	beers.id as beer_id,
	beers.review_text_json,
	beers.name AS beer_name,
	beers.ba_link AS link,
	beers.ba_availability AS beer_availability,
	breweries.name AS brewery_name,
	styles.name as style
	FROM beers, breweries, styles
	WHERE 
	beers.style_id = styles.id
	AND beers.brewery_id = breweries.id
	AND beers.style_id = styles.id
	AND breweries.position IS NOT NULL
	AND beers.review_text_json IS NOT NULL
	AND ST_DWithin(
	    ST_GeomFromText('POINT(${lat} ${long})', 4326),
	    ST_GeomFromText(ST_AsText(position),4326), 10/57.884
	)
	AND beers.ba_availability != 'Limited (brewed once)'
	GROUP BY
	beers.name,
	beers.id,
	breweries.name,
	breweries.position,
	beers.ba_availability,
	beers.ba_link,
	styles.name
	ORDER BY distance ASC;
	`
}

const _localBeerDictionaries = async (location) =>{
	try	{
		let coordsQuery = _coordsQuery(location)
		let results = await _queryResults(coordsQuery)
		return results;
				
	}catch(err){
		return err
	}
}

const _queryResults = async (query)=>{
  try{
    return await sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  }catch(err){
    console.log(err)
  }
}


const _cosineObject = (dictionary1, dictionary2)=>{
	// Initialize the dot product
	// and the values of squaring
	// the matrices
    let numerator = 0
    let dena = 0
    let denb = 0

    for (prop in dictionary1){
    	// dot product calculation
    	numerator += dictionary1[prop] * (dictionary2[prop] !=undefined ? dictionary2[prop] : 0)
    	// squared matrix number 1
    	dena += dictionary1[prop] * dictionary1[prop]
    }
    // We don't check against the first dict
    // Because we have all of the words from second dict
    // We would be adding 0's
    for(prop in dictionary2){
    	// squared matrix number 2
        denb += dictionary2[prop] * dictionary2[prop]
    }
    // Cosine Simularity
    return numerator/Math.sqrt(dena * denb)
}

const _cosineSimularities = (beersList, localBeers)=>{

	let results = beersList.concat(localBeers)

	let matrix = results.slice(0, beersList.length).map(dict =>{
		let row = []
		results.map(innerDict =>{
			row.push(_cosineObject(dict.review_text_json, innerDict.review_text_json))
		})
		return row
	})

	// https://stackoverflow.com/questions/46622486/what-is-the-javascript-equivalent-of-numpy-argsort
	// https://en.wikipedia.org/wiki/Schwartzian_transform
	let cosineSimularityMatches = matrix.map(beerSimilarities =>{

		return  results
		  .map((item, index) => [beerSimilarities[index], item])
		  .sort(([count1], [count2]) => count2 - count1) 
		  .map(([, item]) => item)
	})

	filteredMatchesObj = {}

	cosineSimularityMatches.map( (x,i) =>{
		// let filteredMatch = x
		let filteredMatch = x.filter( y => !beersList.map(bl => bl.beer_id).includes(y.beer_id) ).slice(0, 5)
		filteredMatchesObj[beersList[i].beer_name] = filteredMatch
	})
	return filteredMatchesObj

}