const {sequelize} = require(`${__dirname}/models/index.js`)
const FlavorWheel = require(`${__dirname}/utils/prototypes/flavor-wheel.js`);

const flavorWheelData = async () =>{
	let reviewInfo = 
	`SELECT 
	beers.id as beer_id,
	beers.name as beer_name,
	beers.review_text_json
	FROM beers
	WHERE name = 'Dead Guy Ale'
	GROUP BY beers.id, beer_name`

	let beerData = await sequelize.query(
		reviewInfo,
		{ type: sequelize.QueryTypes.SELECT })

	let flavorWheel = new FlavorWheel()

	return flavorWheel.checkFlavors(beerData[0])
}


flavorWheelData().then(data=> console.log(data))