const {sequelize} = require("./models/index.js")
const {reviewInfoFor} = require("./query-proxy.js")

const jsonData = {
	selectedBeers: [
		{id: 55633},
		{id: 51777}
	],

	location: {
		latitude: 33.769062399999996,
		longitude: -118.188441599999980
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
    	numerator += dictionary1[prop][0] * (dictionary2[prop] !=undefined ? dictionary2[prop][0] : 0)
    	// squared matrix number 1
    	dena += dictionary1[prop][0] * dictionary1[prop][0]
    }
    // We don't check against the first dict
    // Because we have all of the words from second dict
    // We would be adding 0's
    for(prop in dictionary2){
    	// squared matrix number 2
        denb += dictionary2[prop][0] * dictionary2[prop][0]
    }
    // Cosine Simularity
    return numerator/Math.sqrt(dena * denb)
}


reviewInfoFor(jsonData).then(data =>{
	let mergedList = data.selectedBeers.concat(data.localResults);
	let matrix = mergedList.slice(0, data.selectedBeers.length).map((dict) =>{
		let row = []
		mergedList.map(innerDict =>{
			row.push(_cosineObject(dict.review_text_json, innerDict.review_text_json))
		})
		return row
	})

	let cosineSimularityMatches = matrix.map(beerSimilarities =>{

		return  mergedList
		  .map((item, index) => [beerSimilarities[index], item])
		  .sort(([count1], [count2]) => count2 - count1) 
		  .map(([, item]) => item)
	})

	filteredMatchesObj = {}

	cosineSimularityMatches.map( (x,i) =>{
		// let filteredMatch = x
		let filteredMatch = x.filter( y => !data.selectedBeers.map(bl => bl.beer_id).includes(y.beer_id) ).slice(0, 5)
		filteredMatchesObj[data.selectedBeers[i].beer_name] = filteredMatch
	})
	console.log(filteredMatchesObj)
	// return filteredMatchesObj

}).catch(error =>{
	console.log(error);
})