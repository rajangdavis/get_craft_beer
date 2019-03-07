const {sequelize} = require("./models/index.js")

module.exports = {
	
	localBeerDictionaries: async (coordinates) =>{
		try	{
				
			let coordsQuery = _coordsQuery(coordinates)
			// Grab the results of the query
			let results = await _queryResults(coordsQuery)
			// Create an object for keeping track
			// of the entire corpus
			let groupedBeersInfo = {}
			results.map(beerReview =>{
				if(groupedBeersInfo[beerReview.beer_id] == undefined){
					groupedBeersInfo[beerReview.beer_id] = beerReview
				}else{
					groupedBeersInfo[beerReview.beer_id]["review_text_vector"] += ` ${beerReview.review_text_vector}`
				}
			})

			return Object.values(groupedBeersInfo);
					
		}catch(err){
			return err
		}
	},
	beerNames: async ()=>{
		try{
			let beerNamesQuery = `
			SELECT DISTINCT beers.id,
			CONCAT(beers.name,' (', breweries.name,')') as name
			FROM beers, breweries, reviews 
			WHERE breweries.id = beers.brewery_id
			AND reviews.beer_id = beers.id
			AND char_length(reviews.review_text_vector::text) >  14`
			return await sequelize.query(
				beerNamesQuery,
				{ replacements: {}, type: sequelize.QueryTypes.SELECT })

		}catch(err){
			return err
		}
	},

	reviewInfoFor: async (selectedBeers)=>{

		try{
			let reviewInfo = 
			`SELECT beer_id,
			beers.name as beer_name,
			review_text_vector
			FROM reviews, beers
			WHERE beers.id = reviews.beer_id
			AND char_length(review_text_vector::text) > 14 
			AND beer_id IN (:beer_ids);`
			let results =  await sequelize.query(
				reviewInfo,
				{ replacements: { 
					beer_ids: selectedBeers.map(b => parseInt(b.id))
				}, type: sequelize.QueryTypes.SELECT })

			let groupedBeersInfo = {}
			results.map(beerReview =>{
				if(groupedBeersInfo[beerReview.beer_id] == undefined){
					groupedBeersInfo[beerReview.beer_id] = beerReview
				}
				else{
					groupedBeersInfo[beerReview.beer_id]["review_text_vector"] += ` ${beerReview.review_text_vector}`
				}
			})
			// Grab the values
			return Object.values(groupedBeersInfo)
			
		}catch(err){
			return err
		}
	},

}


const _beerNamesLikeQuery = (beerNamesLike) => {
	return `
	SELECT ST_Distance(
	    ST_GeomFromText('POINT(${lat} ${long})', 4326), 
	    ST_GeomFromText(ST_AsText(position), 4326)
	) * 57.884 AS distance, 
	breweries.name AS brewery_name,
	beers.id AS beer_id, 
	beers.name AS beer_name,
	beers.ba_availability AS beer_availability,
	AVG(reviews.review_overall) as overall,
	AVG(reviews.review_taste) as taste,
	AVG(reviews.review_aroma) as aroma,
	AVG(reviews.review_appearance) as appearance,
	AVG(reviews.review_palate) as palate,
	reviews.review_text_vector,
	styles.name as style
	FROM beers, breweries, styles, reviews
	WHERE beers.brewery_id = breweries.id
	AND beers.style_id = styles.id 
	AND beers.id = reviews.beer_id 
	AND breweries.position IS NOT NULL
	AND reviews.review_text_vector IS NOT NULL
	AND ST_DWithin(
	    ST_GeomFromText('POINT(${lat} ${long})', 4326),
	    ST_GeomFromText(ST_AsText(position),4326), 10/57.884
	) 
	GROUP BY
	breweries.name,
	breweries.position,
	beers.name, 
	styles.name, review_text_vector
	ORDER BY distance ASC, overall DESC;
	`
}

 
const _coordsQuery = (coords) => {
	let lat = parseFloat(coords.lat)
	let long = parseFloat(coords.long)

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


const _queryResults = async (query)=>{
  try{
    return await sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
  }catch(err){
    console.log(err)
  }
}