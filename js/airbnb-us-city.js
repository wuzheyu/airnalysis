
airbnbCityGrowthChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
}

airbnbCityGrowthChart.prototype.initVis = function(){
    // load data
	var vis = this;

    vis.filteredData = vis.data.filter(function(d) {
        return (d.Year.getTime() == parseDate(2018).getTime());
    })
    
	// define svg propertities
	vis.margin = {top: 10, right: 20, bottom: 70, left: 50};
	
	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 340 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement)
			.append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.scaleBand()
                .domain(vis.filteredData.map(function(d) { return d.City;}))
                .range([0, vis.width])
                .paddingInner(0.05)
                .round(true)

    vis.y = d3.scaleLinear()
            .domain([300, 180000])
            .range([vis.height, 0]);

    vis.yAxis = d3.axisLeft().scale(vis.y).tickFormat(d3.format(".6"))

    vis.svg.append("g")
            .attr("class", "axis us-city-y-axis")
    vis.svg.append("g")
            .attr("class", "axis us-city-x-axis")
            .attr("transform", "translate(0," + (vis.height) + ")")
    // Create y label
    vis.yLabel = vis.svg.append("text")
    .style("font-size", 12)
    .style("fill", "white")
    .style("font-family", "Montserrat, sans-serif")
    .text("# of listings")
    // Create x label
    vis.xLabel = vis.svg.append("text")
    .attr("x", vis.width - 5)
    .attr("y", vis.height + 15)
    .style("fill", "white")
    .style("font-family", "Montserrat, sans-serif")
    .style("font-size", 12)
    .text("City");
    vis.updateVis()
}

airbnbCityGrowthChart.prototype.wrangleData = function(year){
    var vis = this;
    vis.filteredData = vis.data.filter(function(d) {
        return (d.Year.getTime() == year.getTime());
    })

    vis.updateVis();
}

airbnbCityGrowthChart.prototype.updateVis = function(){
    var vis = this;

    //vis.y.domain(d3.extent(vis.filteredData.map(function(d) { return d.Listings;})))

    vis.rects = vis.svg.selectAll("rect").data(vis.filteredData)
    vis.rects
           .enter()
           .append("rect")
           //.attr("class", "rect")
           .style("fill", "rgb(255,78,87)")
           .on("mouseover", function(d){ return d3.select(this).style("fill", "rgb(255,78,87)")})
           .on("mouseout", function(d) { return d3.select(this).style("fill", "rgb(265,88,97)")})
           .merge(vis.rects)
           .transition()
           .duration(800)
           .attr("x", function(d) { return vis.x(d.City)})
           .attr("y", function(d) { return vis.y(d.Listings)})
           .attr("width", vis.x.bandwidth())
           .attr("height", function(d) {return vis.height - vis.y(d.Listings)})


    
    vis.xAxis = d3.axisBottom().scale(vis.x)

    d3.select(".us-city-y-axis")
           .transition()
           .duration(800)
           .call(vis.yAxis)
           .selectAll("text")
           .style("font-family", "Montserrat, sans-serif")


    // Draw the x axis
    d3.select(".us-city-x-axis")
           .transition()
           .duration(800)
           .call(vis.xAxis)
           .selectAll("text")
           .style("text-anchor", "start")
           .attr("x", 10)
           .attr("y", -10)
           .attr("transform", function(d) { return "rotate(90)"})
           .style("font-family", "Montserrat, sans-serif")

}

