
airbnbCityGrowthChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
}

airbnbCityGrowthChart.prototype.initVis = function(){
    // load data
	var vis = this;

    vis.filteredData = vis.data.filter(function(d) {
        return (d.Year >= parseDate(2018));
    })
    
    console.log(vis.filteredData)
	// define svg propertities
	vis.margin = {top: 10, right: 20, bottom: 70, left: 50};
	
	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 200 - vis.margin.top - vis.margin.bottom;

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
            .range([vis.height, 0]);

    vis.wrangleData()
}

airbnbCityGrowthChart.prototype.wrangleData = function(){
    var vis = this;
    vis.updateVis();
}

airbnbCityGrowthChart.prototype.updateVis = function(){
    var vis = this;

    vis.y.domain(d3.extent(vis.filteredData.map(function(d) { return d.Listings;})))
    console.log(d3.extent(vis.filteredData.map(function(d) { return d.Listings;})))
    vis.svg.selectAll("rect")
           .data(vis.filteredData)
           .enter()
           .append("rect")
           .attr("x", function(d) { return vis.x(d.City)})
           .attr("y", function(d) { return vis.y(d.Listings)})
           .attr("width", vis.x.bandwidth())
           .attr("height", function(d) {return vis.height - vis.y(d.Listings)})
           .style("fill", "rgb(255,78,87)")
           .on("mouseover", function(d){ return d3.select(this).style("fill", "rgb(255,78,87)")})
           .on("mouseout", function(d) { return d3.select(this).style("fill", "rgb(265,88,97)")})

    vis.yAxis = d3.axisLeft().scale(vis.y).tickFormat(d3.format(".2"))
    vis.xAxis = d3.axisBottom().scale(vis.x)

    vis.svg.append("g")
           .attr("class", "axis y-axis")
           .call(vis.yAxis);

    // Draw the x axis
    vis.svg.append("g")
           .attr("class", "axis x-axis")
           .attr("transform", "translate(0," + (vis.height) + ")")
           .call(vis.xAxis)
           .selectAll("text")
           .style("text-anchor", "start")
           .attr("x", 10)
           .attr("y", -10)
           .attr("transform", function(d) { return "rotate(90)"})
}

