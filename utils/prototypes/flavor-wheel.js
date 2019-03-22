const BeerFlavor = require(`${__dirname}/beer-flavor.js`);

function FlavorWheel(){
	this.flavors = [
		new BeerFlavor({name: "Bitter"}),
		new BeerFlavor({name:"Sweet", flavors:["Oversweet", "Syrupy", "Primings", "Vanilla","Jam-like","Honey"]}),
	    new BeerFlavor({name:"Acidic", flavors:["Sour","Acetic"]}),
        new BeerFlavor({name:"Moldy", flavors:["Musty","Earthy"], parent:"Stale"}),
        new BeerFlavor({name:"Stale", flavors:["Leathery","Papery","Catty"]}),
        new BeerFlavor({name:"Sulfery", flavors:["Striking match","Match","Meaty"], parent:"Sulfitic"}),
        new BeerFlavor({name:"Sulfery", flavors:["Hydrogen sulfide","Sulfide","Mercaptan","Garlic","Lightstruck","Autolysed","Burnt Rubber","Rubber","Shrimp-like","Shrimp"], parent:"Sulfidic"}),
        new BeerFlavor({name:"Sulfery", flavors:["Yeast"]}),
        new BeerFlavor({name:"Sulfery", flavors:["Onion","Tomato","Sweetcorn","Corn","Parnsip","Celery","Dimethyl Sulfide","Cabbage","Cooked"], parent:"Cooked Vegetables"}),
        new BeerFlavor({name:"Mouthfeel", flavors:["Metallic","Mouthcoating","Alkaline"]}),
        new BeerFlavor({name:"Mouthfeel", flavors:["Puckering", "Tart", "Drying"], parent:"Astringent"}),
        new BeerFlavor({name:"Mouthfeel", flavors:["Powdery"]}),
        new BeerFlavor({name:"Mouthfeel", flavors:["Flat","Gassy"], parent:"Carbonation"}),
        new BeerFlavor({name:"Mouthfeel", flavors:["Piquant"], parent:"Warming"}),
        new BeerFlavor({name:"Fullness", flavors:["Watery","Characterless","Satiating","Thick"], parent:"Body"}),
        new BeerFlavor({name:"AFFF", flavors:["Spicy","Vinous"], parent:"Alcoholic"}),
        new BeerFlavor({name:"AFFF", flavors:["Plastics","Can-liner","Lacquer"], parent:"Solvent-like"}),
        new BeerFlavor({name:"AFFF", flavors:["Isoamyl Acetate", "Ethyl Hexanoate", "Ethyl acetate", "Ethyl", "Acetate"], parent:"Estery"}),
        new BeerFlavor({name:"AFFF", flavors:["Citrus", "Apple","Banana","Black Currant","Melony","Pear","Raspberry", "Strawberry"], parent:"Fruity"}),
        new BeerFlavor({name:"AFFF", flavors:["Acetaldehyde"]}),
        new BeerFlavor({name:"AFFF", flavors:["2-Phenylethanol", "Geranoil"], parent:"Floral"}),
        new BeerFlavor({name:"AFFF", flavors:["Dry-hop", "Kettle-hop", "Hop oil"], parent:"Hoppy"}),
        new BeerFlavor({name:"Vegetal", flavors:["Piney","Woody"], parent:"Resinous"}),
        new BeerFlavor({name:"Vegetal", flavors:["Walnut","Coconut","Beany", "Almond"], parent:"Nutty"}),
        new BeerFlavor({name:"Vegetal", flavors:["Grass","Straw-like","Straw", "Freshly cut grass"], parent:"Grassy"}),
        new BeerFlavor({name:"Cereal", flavors:["Husky","Corn grits", "Mealy"], parent:"Grainy"}),
        new BeerFlavor({name:"Cereal", flavors:["Malty","Worty"]}),
        new BeerFlavor({name:"Maillard", flavors:["Molasses","Licorice"], parent:"Caramel"}),
        new BeerFlavor({name:"Maillard", flavors:["Bread", "Roast barley", "Crust", "Bread Crust","Smoky", "Barley"], parent:"Burnt"}),
        new BeerFlavor({name:"Phenolic", flavors:["Tarry","Bakelite", "Carbolic","Chlorophenol", "Iodoform"]}),
        new BeerFlavor({name:"Fatty", flavors:["Caprylic","Cheesy","Isovaleric","Butyric"], parent:"Fatty Acids"}),
        new BeerFlavor({name:"Fatty", flavors:["Diacetyl","Rancid"]}),
        new BeerFlavor({name:"Fatty", flavors:["Vegetable oil","Mineral oil", "oil"], parent:"Oily"}),
	]
	this.checkFlavors = beer =>{
		let beerFlavorWheel = {
			name: `${beer['beer_name']} Flavor Wheel`,
            children: []
		}
		this.flavors.map(flavor =>{
			let flavorCheck = flavor.checkFlavors(beer['review_text_json'])
            if(flavorCheck.children.length > 0){
                if(flavorCheck.name == flavorCheck['children'][0]['name']){
                    if(flavorCheck.children[0].name == flavorCheck.children[0].children[0].name){
                        flavorCheck.children[0].children[0].terms = flavorCheck.children[0].terms
                        beerFlavorWheel.children.push(flavorCheck.children[0].children[0])
                    }else{
                        beerFlavorWheel.children.push(flavorCheck.children[0])
                    }

                }else if(beerFlavorWheel.children.map(child => child.name).includes(flavorCheck.name)){
                    let matchedFlavor = beerFlavorWheel.children.filter(child => child.name == flavorCheck.name)[0];
                    matchedFlavor.children += flavorCheck.children
                }else{
                    flavorCheck.children = flavorCheck.children[0]
                    beerFlavorWheel.children.push(flavorCheck)
                }
            }
		})

		return beerFlavorWheel
	}
}

module.exports = FlavorWheel