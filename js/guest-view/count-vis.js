
CountVis = function(_parentElement, _data, _hotel_data){
    this.parentElement = _parentElement;
    this.data = _data;
    // this.eventHandler = _eventHandler;
    this.hotel_data = _hotel_data;

    this.clean_data();
    this.initVis();
}

CountVis.prototype.clean_data = function() {
    var vis = this;

    let rm_dp = (names) => names.filter((v,i) => names.indexOf(v) === i)
    vis.unique_neighborhoods = rm_dp(vis.hotel_data.map(function(d){ return d["nei"]; }));

    vis.displayData = [];
    vis.data.forEach(function(d) {
        if  (vis.unique_neighborhoods.includes(d.neightborhood)) {
            vis.displayData.push(d)
        }
    })
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
    console.log(vis.displayData)
    var domain_arr =  rm_dp(vis.displayData.map(function(d){ return d["neightborhood"]; }));

    console.log(domain_arr)
    vis.x.domain(domain_arr);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.area = d3.area()
        .curve(d3.curveStep)
        .x(function(d) {
            return vis.x(d.neightborhood);
        })
        .y0(vis.height)
        .y1(function(d) {
            return vis.y(d.count);
        });

    console.log(vis.hotel_data)
    vis.area_hotel = d3.area()
        .curve(d3.curveStep)
        .x(function(d) {
            return vis.x(d.nei)
        })
        .y0(vis.height)
        .y1(function(d) {
            return vis.y(d.ave_price);
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


    // bar graphs

    vis.wrangleData();

}

CountVis.prototype.wrangleData = function(){
    var vis = this;

    this.displayData = this.displayData;

    // Update the visualization
    vis.updateVis();
}


CountVis.prototype.updateVis = function() {
    var vis = this;

    console.log("drawing")
    vis.svg.selectAll(".airbnb_pbyn")
        .data(vis.displayData)
        .enter()
        .append("rect")
        .attr("class", "airbnb_pbyn")
        .attr("x", function(d) {
            return vis.x(d.neightborhood)
        })
        .attr("y", function(d) {
            console.log(vis.y(d.count))
            return vis.y(d.count)
        })
        .attr("height", function(d) {
            return vis.height - vis.y(d.count)
        })
        .attr("fill", "black")

    // vis.timePath
    //     .datum(vis.displayData)
    //     .attr("d", vis.area)
    //     .attr("fill", "darkred")
    //     // .attr("clip-path", "url(#clip)");

    // vis.timePath
    //     .datum(vis.hotel_data)
    //     .attr("d", vis.area_hotel)
    //     .attr("fill", "darkred")

    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);

    // console.log("finished rendering count-vis")

    // brush
    vis.brushGroup.call(vis.brush);

}