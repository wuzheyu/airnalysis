
/*
 * CountVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

CountVis = function(_parentElement, _data, _eventHandler ){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;

    this.initVis();
}


/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

CountVis.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // SVG clipping path
    // ***TO-DO***
    // vis.svg.append("defs")
    //     .append("clipPath")
    //     .attr("id", "clip")
    //     .append("rect")
    //     .attr("width", vis.width)
    //     .attr("height", vis.height);


    // Scales and axes
    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y)
        .ticks(6);


    // Set domains
    var minMaxY= [0, d3.max(vis.data.map(function(d){ return d.count; }))];
    vis.y.domain(minMaxY);

    var minMaxX = d3.extent(vis.data.map(function(d){ return d.host_since; }));
    vis.x.domain([new Date(minMaxX[0]), new Date(minMaxX[1]]));

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    // Axis title
    vis.svg.append("text")
        .attr("x", -50)
        .attr("y", -8)
        .text("Number of homes available");


    // Append a path for the area function, so that it is later behind the brush overlay
    vis.timePath = vis.svg.append("path")
        .attr("class", "area area-time");

    // Define the D3 path generator
    vis.area = d3.area()
        .curve(d3.curveStep)
        .x(function(d) {
            return vis.x(d.host_since);
        })
        .y0(vis.height)
        .y1(function(d) { return vis.y(d.count); });


    // Initialize brushing component
    // *** TO-DO ***
    // vis.currentBrushRegion = null;
    // vis.brush = d3.brushX()
    //     .on("brush", function() {
    //         // get the specific region selected by user
    //         vis.currentBrushRegion = d3.event.selection;
    //         vis.currentBrushRegion = vis.currentBrushRegion.map(vis.x.invert);
    //
    //         //triger the event of the event handler
    //         $(vis.eventHandler).trigger("selectionChanged", vis.currentBrushRegion);
    //     })
    //     .extent([[0, 0], [vis.width, vis.height]]);


    // Append brush component here
    // *** TO-DO ***
    // vis.brushGroup = vis.svg.append("g")
    //     .attr("class", "brush")

    // Add zoom component
    // *** TO-DO ***
    //
    // vis.xOrig = vis.x; // save original scale
    //
    vis.zoomFunction = function() {
        vis.x = d3.event.transform.rescaleX(vis.xOrig);

        // check if the brush is active
        if (vis.currentBrushRegion) {
            vis.brushGroup.call(vis.brush.move, vis.currentBrushRegion.map(vis.x))
        }
        vis.updateVis();
    }
    // function that is being called when user zooms
    //
    // vis.zoom = d3.zoom()
    //     .on("zoom", vis.zoomFunction)
    //     .scaleExtent([1,20]);


    // disable mousedown and drag in zoom, when you activate zoom (by .call)
    // *** TO-DO ***

    // init the time period label
    // var formatTime = d3.timeFormat("%Y-%m-%d");
    // d3.select("#time-period-min").text(formatTime(minMaxX[0]));
    // d3.select("#time-period-max").text(formatTime(minMaxX[1]));

    // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

CountVis.prototype.wrangleData = function(){
    var vis = this;

    this.displayData = this.data;

    // Update the visualization
    vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

CountVis.prototype.updateVis = function(){
    var vis = this;

    // Call brush component here
    // *** TO-DO ***
    // vis.brushGroup.call(vis.brush);
    // vis.brushGroup.call(vis.zoom)
    //     .on("mousedown.zoom", null)
    //     .on("touchstart.zoom", null);

    // Call the area function and update the path
    // D3 uses each data point and passes it to the area function.
    // The area function translates the data into positions on the path in the SVG.
    vis.timePath
        .datum(vis.displayData)
        .attr("d", vis.area)
        .attr("clip-path", "url(#clip)");


    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);
}

CountVis.prototype.onSelectionChange = function(selectionStart, selectionEnd){
    // update the label showing current time period
    console.log(selectionEnd)

    var formatTime = d3.timeFormat("%Y-%m-%d");
    d3.select("#time-period-min").text(formatTime(selectionStart));
    d3.select("#time-period-max").text(formatTime(selectionEnd));

}
