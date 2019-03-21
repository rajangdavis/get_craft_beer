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
        new BeerFlavor({name:"Sulfery", flavors:["Yeasty"]}),
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
			beerFlavorWheel.children.push(flavorCheck)
		})

		return beerFlavorWheel
	}
}

module.exports = FlavorWheel

//     def check_flavors(self, beer):
//         beer_flavor_wheel = {
//             "name": f"{beer['beer_name']} Flavor Wheel",
//             "children" : []
//         }
//         for flavor in self.flavors:
//             flavor_check = flavor.check_flavors(beer['review_text_json'])
//             if(len(flavor_check['children']) > 0):
//                 try:
//                     if flavor_check['name'] == flavor_check['children'][0]['name']:
//                         if flavor_check['children'][0]['name'] == flavor_check['children'][0]['children'][0]['name']:
//                             flavor_check['children'][0]['children'][0]['terms'] = flavor_check['children'][0]['terms']
//                             beer_flavor_wheel["children"].append(flavor_check['children'][0]['children'][0])
//                         else:
//                             beer_flavor_wheel["children"].append(flavor_check['children'][0])
//                     elif(flavor_check['name'] in [child['name'] for child in beer_flavor_wheel["children"]]):
//                         matched_flavor = [child for child in beer_flavor_wheel["children"] if child['name'] == flavor_check['name']][0]
//                         matched_flavor['children'] += flavor_check["children"]
//                     else:
//                         flavor_check['children'] = flavor_check['children'][0]
//                         beer_flavor_wheel["children"].append(flavor_check)
//                 except Exception as e:
//                     pass
//         return beer_flavor_wheel