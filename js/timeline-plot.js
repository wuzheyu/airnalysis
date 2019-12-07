
timelinePlot = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
}

timelinePlot.prototype.initVis = function(){
    // load data
	var vis = this;

	// define svg propertities
	vis.margin = {top: 20, right: 50, bottom: 50, left: 80};
	
	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 155 - vis.margin.top - vis.margin.bottom;
    
	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement)
			.append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
    
    vis.svg.append("g")
            .attr("class", "axis airbnb-share-growth-y-axis")
    vis.svg.append("g")
            .attr("class", "axis airbnb-share-growth-x-axis")
            .attr("transform", "translate(0," + (vis.height) + ")")

    vis.xScale = d3.scaleTime()
    .domain([
         d3.min(vis.data, function(d) { return d.year; }),
         d3.max(vis.data, function(d) { return d.year; })
     ])
    .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .domain([0, d3.max(vis.data, function(d) { return d.share; })])
        .range([vis.height, 0]);
    
    vis.yAxis = d3.axisLeft().scale(vis.yScale).tickFormat(d3.format(".0%")).ticks(3);
    vis.xAxis = d3.axisBottom().scale(vis.xScale)
    vis.yLabel = vis.svg.append("text")
                        .attr("x", -10)
                        .style("font-size", 12)
                        .style("fill", "white")
                        .style("font-family", "Montserrat, sans-serif")
                        .text("% of customer share")
                        // Create x label
    vis.xLabel = vis.svg.append("text")
                    .attr("x", vis.width - 5)
                    .attr("y", vis.height + 25)
                    .style("fill", "white")
                    .style("font-family", "Montserrat, sans-serif")
                    .style("font-size", 12)
                    .text("Year");
    vis.line = d3.line()
            .x(function(d) { return vis.xScale(d.year); })
            .y(function(d) { return vis.yScale(d.share); });

    vis.linePath = vis.svg.append("path")
            .datum(vis.data)
            .attr("class", "airbnb-share-growth-line")
            .attr("d", vis.line);       
    vis.totalLength = vis.linePath.node().getTotalLength();
    const transitionPath = d3.transition()
                            .ease(d3.easeSin)
                            .duration(16000);

    vis.linePath.attr("stroke-dashoffset", vis.totalLength)
                .attr("stroke-dasharray", vis.totalLength)
                .transition(transitionPath)
                .attr("stroke-dashoffset", 0);

    d3.select('.airbnb-share-growth-x-axis').call(vis.xAxis);
    d3.select('.airbnb-share-growth-y-axis').call(vis.yAxis);


}

// timelinePlot.prototype.wrangleData = function(){
//     var vis = this;
//     vis.updateVis();
// }

// timelinePlot.prototype.updateVis = function(){
//     var vis = this;


// }

