RadarVis = function(_parentElement, _rating, _hotel_rating){
    this.parentElement = _parentElement;
    this.rating = _rating;
    this.hotel_rating = _hotel_rating;
    this.hotelColor = "#038C8C"
    this.airbnbColor = "#F28D95"

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
    console.log(vis.hotel_rating)

    vis.margin = {top: 20, right: 50, bottom: 120, left: 60};

    // vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 350 - vis.margin.top - vis.margin.bottom;
    vis.width = 610 - vis.margin.left - vis.margin.right;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("transform", "translate(0, 0)")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.radialScale = d3.scaleLinear()
        .domain([3.7, 5])
        .range([0, 100])
    vis.ticks = [3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0]
    vis.tickLabels = [4.2, 4.6, 5.0]
    var ticks_rev = vis.ticks.reverse()

    // render radial circles
    ticks_rev.forEach(t =>
        vis.svg.append("circle")
            .attr("cx", 150)
            .attr("cy", 150)
            .attr("fill", "white")
            .attr("stroke", "black")
            // .attr("stroke-width", 3)
            // .attr("class", "radialAxis")
            .attr("r", vis.radialScale(t))
    );

    // render texts for ticks
    vis.tickLabels.forEach(t =>
        vis.svg.append("text")
            .attr("x", 150)
            .attr("y", 150 - vis.radialScale(t))
            // .attr("class", "radialAxisText")
            .style("font-size", "12px")
            .attr("fill", function() {
                if (t == 5.0) {
                    return "white"
                }
                else {
                    return "black"
                }
            })
            .text(t.toString())
    );

    // function angleToCoordinate(angle, value) {
    //     let x = Math.cos(angle) * vis.radialScale(value);
    //     let y = Math.sin(angle) * vis.radialScale(value);
    //     return {"x": 150 + x, "y": 150 - y};
    // }

    vis.features = ["total", "clean", "reply", "check-in", "accuracy", "location", "value"]

    for (var i = 0; i < vis.features.length; i++) {
        let ft_name = vis.features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.features.length);
        let line_coordinate = vis.angleToCoordinate(angle, 5);
        let label_coordinate = vis.angleToCoordinate(angle, 5.4);

        //draw axis line
        vis.svg.append("line")
            .attr("x1", 150)
            // .attr("class", "radialAxisLines")
            .attr("fill", "black")
            .attr("y1", 150)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke", "black");

        //draw axis label
        vis.svg.append("text")
            .attr("x", label_coordinate.x)
            .attr("y", label_coordinate.y)
            .attr("class", "radialAxisText")
            .text(ft_name)
            .style("font-size", "11px")
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
    vis.hotel_coords = []
    for (var i = 0; i < vis.rating.length; i++){
        let d = vis.rating[i];
        let d2 = vis.hotel_rating[i];
        // let color = vis.colors[i];
        vis.coordinates.push(getPathCoordinates(d));
        vis.hotel_coords.push(getPathCoordinates(d2));

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

    var all_paths = vis.svg.selectAll(".airbnbRadar").data(vis.coordinates);
    all_paths.enter()
        .append("path")
        .merge(all_paths)
        .attr("d",vis.line)
        .attr("class", "airbnbRadar")
        .attr("stroke-width", 3)
        .attr("fill", this.airbnbColor)
        // .attr("stroke", function(d, index) {
        //     return vis.colors[index]
        // })
        // .attr("fill", function(d, index) {
        //     return vis.colors[index]
        // })
        .attr("stroke-opacity", 1)
        .attr("opacity", function(d, index) {
            if (index == area) {
                return 0.5;
            }
            else {
                return 0;
            }
        });

    var all_paths_hotel = vis.svg.selectAll(".hotelRadar").data(vis.hotel_coords);
    all_paths_hotel.enter()
        .append("path")
        .merge(all_paths_hotel)
        .attr("d",vis.line)
        .attr("class", "hotelRadar")
        .attr("stroke-width", 3)
        .attr("fill", this.hotelColor)
        // .attr("stroke", function(d, index) {
        //     return vis.colors[index]
        // })
        // .attr("fill", function(d, index) {
        //     return vis.colors[index]
        // })
        .attr("stroke-opacity", 1)
        .attr("opacity", function(d, index) {
            if (index == area) {
                return 0.8;
            }
            else {
                return 0;
            }
        });
}

