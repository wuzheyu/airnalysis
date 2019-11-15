

/*
 * MapChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

MapChart = function(_parentElement, _data){
	this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling

    // DEBUG RAW DATA
    console.log(this.data);

    this.initVis();
};

/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

MapChart.prototype.initVis = function(){
	var vis = this;


	vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

	vis.width = 600 - vis.margin.left - vis.margin.right,
    vis.height = 500 - vis.margin.top - vis.margin.bottom;


  // SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
       .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // initialize projection and path
    // might have to adjust scale and center for different maps
    var projection = d3.geoMercator()
        .translate([vis.width / 2, vis.height / 2])
        .scale(50000)
        .center([-73.9,40.7]);
        // .clipExtent([[0,0],[1000,700]]);
    // For boston: .scale(110000)
    //         .center([-71.06,42.32]);

    var path = d3.geoPath()
        .projection(projection);

    // Render the map by using the path generator
    vis.svg.selectAll("path")
        .data(vis.data.contour.features)
        .enter().append("path")
        .attr("d", path);

    // Add listing circles
    var circles = vis.svg.selectAll(".listing")
        .data(vis.data.listings)
        .enter().append("circle")
        .attr("class", "listing")
        .attr("r", 2)
        .attr("transform", function(d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")";
        });

	// // TO-DO: Tooltip placeholder
    // vis.svg.append("text")
    //     .attr("class", "label")
    //     .attr("x", 20)
    //     .attr("y", 0);

	// TO-DO: (Filter, aggregate, modify data)
    // vis.wrangleData();
}



/*
 * Data wrangling
 */

MapChart.prototype.wrangleData = function(){
	var vis = this;

	// In the first step no data wrangling/filtering needed
	vis.displayData = vis.stackedData;

	// Update the visualization
    vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

MapChart.prototype.updateVis = function(){
	var vis = this;

	// Update domain
	// Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
	vis.y.domain([0, d3.max(vis.displayData, function(d) {
			return d3.max(d, function(e) {
				return e[1];
			});
		})
	]);

    var dataCategories = colorScale.domain();

// Draw the layers
    var categories = vis.svg.selectAll(".area")
        .data(vis.displayData);

    categories.enter().append("path")
        .attr("class", "area")
        .merge(categories)
        .style("fill", function(d,i) {
            return colorScale(dataCategories[i]);
        })
        .attr("d", function(d) {
            return vis.area(d);
        })
        // To-do: Update tooltip text
        .on("mouseover", function(d,i){
        vis.svg.select(".label").text(dataCategories[i]);
        })
        .on("mouseout",function(d,i){
        vis.svg.select(".label").text("");
        });

	categories.exit().remove();


	// Call axis functions with the new domain 
	vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);
}
