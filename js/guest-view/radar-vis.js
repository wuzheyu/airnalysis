RadarVis = function(_parentElement, _rating){
    this.parentElement = _parentElement;
    this.rating = _rating;

    // this.clean_data();
    this.initVis();
}

RadarVis.prototype.angleToCoordinate = function(angle, value) {
    const vis = this;
    let x = Math.cos(angle) * vis.radialScale(value);
    let y = Math.sin(angle) * vis.radialScale(value);
    return {"x": 150 + x, "y": 150 - y};
}


RadarVis.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 50, right: 50, bottom: 120, left: 50};

    // vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 500 - vis.margin.top - vis.margin.bottom;
    vis.width = 610 - vis.margin.left - vis.margin.right;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("transform", "translate(0, 0)")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.radialScale = d3.scaleLinear()
        .domain([4.2, 5])
        .range([0, 100])
    vis.ticks = [4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0]

    // render radial circles
    vis.ticks.forEach(t =>
        vis.svg.append("circle")
            .attr("cx", 150)
            .attr("cy", 150)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("r", vis.radialScale(t))
    );

    // render texts for ticks
    vis.ticks.forEach(t =>
        vis.svg.append("text")
            .attr("x", 150)
            .attr("y", 150 - vis.radialScale(t))
            .text(t.toString())
    );

    // function angleToCoordinate(angle, value) {
    //     let x = Math.cos(angle) * vis.radialScale(value);
    //     let y = Math.sin(angle) * vis.radialScale(value);
    //     return {"x": 150 + x, "y": 150 - y};
    // }

    vis.features = ["total", "cleanliness", "communication", "check-in", "accuracy", "location", "value"]

    for (var i = 0; i < vis.features.length; i++) {
        let ft_name = vis.features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.features.length);
        let line_coordinate = vis.angleToCoordinate(angle, 5);
        let label_coordinate = vis.angleToCoordinate(angle, 5.2);

        //draw axis line
        vis.svg.append("line")
            .attr("x1", 150)
            .attr("y1", 150)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke", "black");

        //draw axis label
        vis.svg.append("text")
            .attr("x", label_coordinate.x)
            .attr("y", label_coordinate.y)
            .text(ft_name)
            .style("text-anchor", "middle")

    }

    vis.line = d3.line()
        .x(d => d.x)
        .y(d => d.y);
    vis.colors = ["darkorange", "gray", "navy", "darkred", "yellow", "green", "purple","darkblue", "pink", "darkgreen", "orange"];

    // function getPathCoordinates(data_point) {
    //     let coordinates = [];
    //     for (var i = 0; i < vis.features.length; i++) {
    //         let ft_name = vis.features[i];
    //         let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.features.length);
    //         coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    //     }
    //     return coordinates;
    // }

    vis.updateVis(0)
}

RadarVis.prototype.updateVis = function(area) {
    var vis = this;

    function getPathCoordinates(data_point) {
        let coordinates = [];
        for (var i = 0; i < vis.features.length; i++) {
            let ft_name = vis.features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.features.length);
            coordinates.push(vis.angleToCoordinate(angle, data_point[ft_name]));
        }
        return coordinates;
    }

    vis.coordinates = []
    for (var i = 0; i < vis.rating.length; i++){
        let d = vis.rating[i];
        // let color = vis.colors[i];
        vis.coordinates.push(getPathCoordinates(d));
        // var opa = 0;
        // if (i == area) {
        //     opa = 1
        // } else {
        //     opa = 0
        // }

        // //draw the path element
        // vis.svg.append("path")
        //     .datum(coordinates)
        //     .attr("d",vis.line)
        //     .attr("stroke-width", 3)
        //     .attr("stroke", color)
        //     .attr("fill", color)
        //     .attr("stroke-opacity", 1)
        //     .attr("opacity", opa);
    }

    var all_paths = vis.svg.selectAll("path").data(vis.coordinates);
    all_paths.enter()
        .append("path")
        .merge(all_paths)
        .attr("d",vis.line)
        .attr("stroke-width", 3)
        .attr("stroke", function(d, index) {
            return vis.colors[index]
        })
        .attr("fill", function(d, index) {
            return vis.colors[index]
        })
        .attr("stroke-opacity", 1)
        .attr("opacity", function(d, index) {
            if (index == area) {
                return 0.5;
            }
            else {
                return 0;
            }
        });
}

