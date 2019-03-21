const SKIP_WORDS = require(`${__dirname}/../skip-words.js`);

function BeerFlavor(props){
	this.name = props.name
	this.parent = props.parent || props.name
	this.flavors = props.flavors || [props.name]
	this.finalFlavorObj = {
		name: this.parent,
		children: []
	}
	this.flavorKeys = []
	this.checkFlavors = beerJson =>{
		let flavorObject = {}
		let checkedTerms = []
		Object.keys(beerJson).map(key=>{
			this.flavors.map(flavor =>{
				if(!SKIP_WORDS.includes(key) && key.indexOf(flavor.toLowerCase()) > -1){
					checkedTerms.push(key)
					if(!Object.keys(flavorObject).includes(flavor)){
						flavorObject[flavor] = 0
					}
					flavorObject[flavor] += parseInt(beerJson[key][0])
				}
			})
		})
		return this._normalizeFlavorObject(flavorObject, checkedTerms);
	}
	this._normalizeFlavorObject = (flavorObject, flavorTerms)=>{
		Object.keys(flavorObject).map(key =>{
			if(!this.flavorKeys.includes(key))
				this.flavorKeys.push(key)
				this.finalFlavorObj["children"].push({
					terms: flavorTerms,
					name: this.name,
					children: Object.keys(flavorObject).map(k =>{
						return {"name": k, "value": flavorObject[k]}
					})
				})
		})
		return this.finalFlavorObj
	}
}

module.exports = BeerFlavor;