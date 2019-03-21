const {sequelize} = require(`${__dirname}/models/index.js`)
const {cosineSimularities} = require(`${__dirname}/utils/recommendations.js`)

module.exports = {

	reviewInfoFor: async (jsonData)=>{

		try{
			let localResults = await _localBeerDictionaries(jsonData.location);

			console.log(localResults)

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

			return cosineSimularities(selectedBeers, localResults);
		
		}catch(err){
			return err
		}
	}

}

const _localBeerDictionaries = async (location) =>{
	try	{
		let coordsQuery = `
		SELECT ST_Distance(
		    ST_GeomFromText('POINT(:lat :long)', 4326),
		    ST_GeomFromText(ST_AsText(position), 4326)
		) * 57.884 AS distance,
		beers.id as beer_id,
		beers.review_text_json,
		beers.abv,
		beers.name AS beer_name,
		beers.ba_link AS link,
		beers.ba_availability AS beer_availability,
		breweries.name AS brewery_name,
		breweries.address AS brewery_address,
		breweries.city AS brewery_city,
		breweries.state AS brewery_state,
		breweries.zipcode AS brewery_zipcode,
		styles.name as style
		FROM beers, breweries, styles
		WHERE 
		beers.style_id = styles.id
		AND beers.brewery_id = breweries.id
		AND beers.style_id = styles.id
		AND breweries.position IS NOT NULL
		AND beers.review_text_json IS NOT NULL
		AND ST_DWithin(
		    ST_GeomFromText('POINT(:lat :long)', 4326),
		    ST_GeomFromText(ST_AsText(position),4326), 10/57.884
		)
		AND beers.ba_availability != 'Limited (brewed once)'
		ORDER BY distance ASC;
		`
    	return await sequelize.query(coordsQuery, { replacements: { 
			lat: parseFloat(location.latitude),
			long: parseFloat(location.longitude)
		},type: sequelize.QueryTypes.SELECT})
				
	}catch(err){
		return err
	}
}
