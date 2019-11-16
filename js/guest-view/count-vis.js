
CountVis = function(_parentElement, _data, _eventHandler ){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;

    this.initVis();
}

CountVis.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 40, right: 0, bottom: 60, left: 60};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.scaleBand()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y)


    var minMaxY= [0, d3.max(vis.data.map(function(d){ return d.count; }))];
    vis.y.domain(minMaxY);

    let rm_dp = (names) => names.filter((v,i) => names.indexOf(v) === i)
    var neighbors_uniq = rm_dp(vis.data.map(function(d){ return d["neightborhood"]; }));

    vis.x.domain(neighbors_uniq);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    console.log(vis.x.domain())
    console.log(vis.height)
    console.log(vis.x.range())
    console.log(vis.y.range())


    vis.area = d3.area()
        .curve(d3.curveStep)
        .x(function(d) {
            return vis.x(d.neightborhood);
        })
        .y0(vis.height)
        .y1(function(d) {
            return vis.y(d.count);
        });

    vis.timePath = vis.svg.append("path")
        .attr("class", "area area-time");


    /* brush  */
    vis.currentBrushRegion = null;
    vis.brush = d3.brushX()
        .on("brush", function() {
            // get the specific region selected by user
            vis.currentBrushRegion = d3.event.selection;
            vis.currentBrushRegion = vis.currentBrushRegion.map(vis.x.invert);

            //triger the event of the event handler
            $(vis.eventHandler).trigger("selectionChanged", vis.currentBrushRegion);
        })
        .extent([[0, 0], [vis.width, vis.height]]);

        vis.brushGroup = vis.svg.append("g")
            .attr("class", "brush")

    vis.wrangleData();

}

CountVis.prototype.wrangleData = function(){
    var vis = this;

    this.displayData = this.data;

    // Update the visualization
    vis.updateVis();
}


CountVis.prototype.updateVis = function() {
    var vis = this;

    vis.timePath
        .datum(vis.displayData)
        .attr("d", vis.area)
        .attr("fill", "darkred")
        // .attr("clip-path", "url(#clip)");

    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);

    console.log("finished rendering count-vis")

    // brush
    vis.brushGroup.call(vis.brush);

}