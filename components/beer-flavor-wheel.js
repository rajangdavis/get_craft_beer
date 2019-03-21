import React, { Component } from 'react'
const d3 = require("d3")


class BeerFlavorWheel extends Component {

	state ={
		width: 932,
		height: 932
	}

	runOnLoad = (data) => {

		let autosize = svg => {
		  console.log(svg)
		  // document.body.appendChild(svg);
		  // document.body.removeChild(svg);
		  // let box = svg.getBBox();
		  // svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
		  // return svg;
		}

		let width = this.state.width

		let radius = width / 2
		
		let arc = d3.arc()
		    .startAngle(d => d.x0)
		    .endAngle(d => d.x1)
		    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
		    .padRadius(radius / 2)
		    .innerRadius(d => d.y0)
		    .outerRadius(d => d.y1 - 1)

		let format = d3.format(",d")

		let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

		let partition = data => d3.partition()
		    .size([2 * Math.PI, radius])
		  (d3.hierarchy(data)
		    .sum(d => d.value)
		    .sort((a, b) => b.value - a.value))

		let root = partition(data);

		let svg = d3.select(this.svgEl)
		  .style("width", "50%")
		  .style("margin", "0 auto")
		  .style("display", "block")
		  .style("height", "auto")
		  .style("padding", "10px")
		  .style("font", "30px sans-serif")
		  .style("box-sizing", "border-box");

		svg.append("g")
		  .attr("fill-opacity", 0.6)
		.selectAll("path")
		.data(root.descendants().filter(d => d.depth))
		.enter().append("path")
		  .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
		  .attr("d", arc)
		.append("title")
		  .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);  
		svg.append("g")
		  .attr("pointer-events", "none")
		  .attr("text-anchor", "middle")
		.selectAll("text")
		.data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
		.enter().append("text")
		  .attr("transform", function(d) {
		    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
		    const y = (d.y0 + d.y1) / 2;
		    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
		  })
		  .attr("dy", "0.35em")
		  .attr("id", d => d.data.name.split(", ").join(""))
		  .text(d => d.data.name)

		return autosize(svg.node());
	}

	componentDidMount() {
	  this.runOnLoad(this.props.svgData)
	}

	componentDidUpdate() {
	  this.runOnLoad(this.props.svgData)
	}

	render(){

		 return <div id={this.props.svgData.name.replace(/ /g,"_")}>
             <svg
               width={this.state.width}
               height={this.state.height}
               ref={el => this.svgEl = el} >
             </svg>
           </div>
	}
}
export default BeerFlavorWheel