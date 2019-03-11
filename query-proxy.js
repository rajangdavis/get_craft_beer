const {sequelize} = require("./models/index.js")

module.exports = {

	reviewInfoFor: async (jsonData)=>{

		try{
			let localResults = await _localBeerDictionaries(jsonData.location);

			let reviewInfo = 
			`SELECT beer_id,
			beers.name as beer_name,
			review_text_vector
			FROM reviews, beers, breweries
			WHERE beers.id = reviews.beer_id
			AND beers.brewery_id = breweries.id
			AND char_length(review_text_vector::text) > 14 
			AND beer_id IN (:beer_ids);`
			let results =  await sequelize.query(
				reviewInfo,
				{ replacements: { 
					beer_ids: jsonData.selectedBeers.map(b => parseInt(b.id))
				}, type: sequelize.QueryTypes.SELECT })

			let groupedBeersInfo = {}

			localResults.map(beerReview =>{
				if(groupedBeersInfo[beerReview.beer_id] == undefined){
					groupedBeersInfo[beerReview.beer_id] = beerReview
				}
				else{
					groupedBeersInfo[beerReview.beer_id]["review_text_vector"] += ` ${beerReview.review_text_vector}`
				}
			})
			// Grab the values
			return _cosineSimularities(results, localResults);
		
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
	beers.name AS beer_name,
	beers.ba_link AS link,
	beers.ba_availability AS beer_availability,
	breweries.name AS brewery_name,
	reviews.review_text_vector,
	styles.name as style
	FROM beers, breweries, styles, reviews
	WHERE beers.brewery_id = breweries.id
	AND beers.style_id = styles.id 
	AND beers.id = reviews.beer_id 
	AND breweries.position IS NOT NULL
	AND char_length(reviews.review_text_vector::text) > 14
	AND ST_DWithin(
	    ST_GeomFromText('POINT(${lat} ${long})', 4326),
	    ST_GeomFromText(ST_AsText(position),4326), 10/57.884
	) 
	GROUP BY
	breweries.name,
	breweries.position,
	beers.id,
	beers.name,
	beers.ba_availability,
	beers.ba_link,
	reviews.review_overall,
	styles.name, review_text_vector
	ORDER BY distance ASC, review_overall DESC;
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


const _vectToDict = (tsv) =>{
	let counts = {}
		// split on a text_vector string
		// \'glass\':42 \'goe\':118 \'good\':35,83,98,105,111,113
		// becomes
		// ["'glass':42", "'goe':118", "'good':35,83,98,105,111,113"]
		tsv.review_text_vector.split(" ").map(x => { 
			// ["'glass':42", "'goe':118", "'good':35,83,98,105,111,113"]
			// becomes
			//["'glass':42", "'goe':118", "'good':35,83,98,105,111,113"]
			let v = x.replace(/'/g,"").split(':')
			if(v.length!=2){
				// console.log(tsv)
				// console.log(v)
			}
			//["'glass':42", "'goe':118", "'good':35,83,98,105,111,113"]
			// becomes
			//[["glass", "42"]
			// ["goe", "118"]
			// ["good", "35,83,98,105,111,113"]]

			// Create a key if one does not exist
			if(counts[v[0]] == undefined){
				counts[v[0]] = 0;
			}
			// increment based on the numbers
			counts[v[0]]+= v[1].split(",").length
		})
	return counts;
}

// This transforms the tsVectors from
// Postgres into objects/dictionaries with word counts
const _cleanVectors = (vectorsToMap) =>{

	// An array that will store the counts
	let beerDictionaries = []
	// Loop through the array of objects/dicts
	vectorsToMap.filter(x=> x.review_text_vector != null &&  x.review_text_vector != '' ).map(tsv =>{
		let counts = _vectToDict(tsv);

		beerDictionaries.push(counts)
	})
	return beerDictionaries
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

	let countDicts = _cleanVectors(results)

	let matrix = countDicts.slice(0, beersList.length).map(dict =>{
		let row = []
		countDicts.map(innerDict =>{
			row.push(_cosineObject(dict, innerDict))
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