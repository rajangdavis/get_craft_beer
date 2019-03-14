module.exports = {

	cosineSimularities: function(selectedBeers, localResults){
		let mergedList = selectedBeers.concat(localResults);
		let matrix = mergedList.slice(0, selectedBeers.length).map((dict) =>{
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
			let filteredMatch = x.slice(1, 6).map(y =>{
				delete y.review_text_json;
				return y;
			});
			
			filteredMatchesObj[selectedBeers[i].beer_name] = filteredMatch
		})
		return filteredMatchesObj
		
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
