const {sequelize} = require("../models/index.js")
const {cosineSimularities} = require("./recommendations.js")

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

			return cosineSimularities(selectedBeers, localResults);
		
		}catch(err){
			return err
		}
	},

	beersWithReviews: async (beerName) =>{
		try{
			let namesQuery =`
			SELECT beers.id, 
			beers.name || ' (' || breweries.name || ')' as name 
			FROM beers, breweries 
			WHERE beers.name ILIKE :name_query 
			AND beers.brewery_id = breweries.id 
			AND beers.review_text_json IS NOT NULL
			LIMIT 4;
			`
			return await sequelize.query(
				namesQuery,
				{ replacements: { 
					name_query: `%${beerName}%`
				}, type: sequelize.QueryTypes.SELECT });

		}catch(err){
			return err;
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
		    ST_GeomFromText('POINT(:lat :long)', 4326),
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
    	return await sequelize.query(coordsQuery, { replacements: { 
			lat: parseFloat(location.latitude),
			long: parseFloat(location.longitude)
		},type: sequelize.QueryTypes.SELECT})
				
	}catch(err){
		return err
	}
}
