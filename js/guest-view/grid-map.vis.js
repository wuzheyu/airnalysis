gridMapVis =  function(_parentElement, _data, _hotel_data, _air_rating, _hotel_rating){
    this.parentElement = _parentElement;
    this.data = _data;
    // this.eventHandler = _eventHandler;
    this.hotel_data = _hotel_data;
    this.airbnbRating = _air_rating;
    this.hotelRating = _hotel_rating;
    this.diff = false;
    this.diffColor = "grey"
    this.hotelColor = "#038C8C"
    this.airbnbColor = "#F28D95"
    const hlColor = "rgb(255,78,87)"
    this.started = 0;


    this.allDiff = [];
    for (var i = 0; i < 16; i++) {
        this.allDiff.push(true);
    }

    this.clean_data();
    this.initVis();
}

gridMapVis.prototype.initVis = function() {
    var vis = this;

    vis.grey_out = [0, 1, 3, 4, 13, 15]
    vis.areas = [];

    vis.margin = {top: 20, right: 0, bottom: 100, left: 40};

    // vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 300 - vis.margin.top - vis.margin.bottom;
    vis.width = 610 - vis.margin.left - vis.margin.right;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("transform", "translate(0, 0)")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.y = d3.scaleLinear()
        .range([0, 50]);
    vis.y2 = d3.scaleLinear()
        .range([0, 50]);
    vis.yDis = d3.scaleLinear()
        .range([50, 0]);
    var MaxY= d3.max(vis.displayData.map(function(d){ return (d.hotel_price - d.avg_price); }));
    vis.y2.domain([0,MaxY + 7]);
    var MaxY2= d3.max(vis.displayData.map(function(d){ return (d.avg_price); }));
    var MaxYHot =  d3.max(vis.displayData.map(function(d){ return (d.hotel_price); }));
    // var MaxY_hotel = d3.max(vis.hotel_data.map(function(d){ return d.ave_price; }));
    vis.y.domain([0, Math.max(MaxY2, MaxYHot) + 10]);
    vis.yDis.domain(vis.y.domain())

    vis.neigh_order = ["none", "none", "Back Bay", "none", "none",  "West End", "Beacon Hill",
        "South End", "Charlestown", "North End", "Downtown", "South Boston", "East Boston",
        "none", "South Boston Waterfront", "none"]

    vis.neigh_ind = [-1, -1, 0, -1, -1, 9, 1, 8, 2, 5, 3, 6, 4, -1, 7, -1]

    vis.renderLegend()

    vis.renderGrid();
}

gridMapVis.prototype.renderLegend = function() {
    const vis = this;

    // SQUARES
    vis.svg.append("rect")
        .attr("x", 380)
        .attr("y", 40)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", vis.airbnbColor)

    vis.svg.append("rect")
        .attr("x", 380)
        .attr("y", 59)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", vis.hotelColor)

    vis.svg.append("rect")
        .attr("x", 380)
        .attr("y", 80)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", vis.diffColor)

    // TEXTS
    vis.svg.append("text")
        .attr("x", 400)
        .attr("y", 50)
        .text("Airbnb Price / Rating")
        .attr("fill", vis.airbnbColor)

    vis.svg.append("text")
        .attr("x", 400)
        .attr("y", 70)
        .text("Hotel Price / Rating")
        .attr("fill", vis.hotelColor)

    vis.svg.append("text")
        .attr("x", 400)
        .attr("y", 90)
        .text("Hotel Price - Airbnb Price")
        .attr("fill", vis.diffColor)

    vis.svg.append("g")
        .attr("class", "price-axis axis")
        // .attr("x", 420)
        // .attr("y", 200)
        .attr("transform", "translate(10, 140)")
    vis.yAxis = d3.axisLeft()
        .scale(vis.yDis).ticks(4)
    vis.svg.select(".price-axis").call(vis.yAxis).append("text").text("Price Scale")
        .attr("y", -20)
        .attr("text-anchor", "middle")
    vis.svg.select(".price-axis").call(vis.yAxis).append("text").text("(in USD)")
        .attr("y", -8)
        .attr("text-anchor", "middle")

    vis.svg.append("text")
        .attr("x", 380)
        .attr("y", 120)
        .attr("id", "tooltip1")
        .text("")
        .attr("fill", "white")

    vis.svg.append("text")
        .attr("x", 380)
        .attr("y", 140)
        .attr("id", "tooltip2")
        .text("")
        .attr("fill", "white")

    vis.svg.append("text")
        .attr("x", 380)
        .attr("y", 160)
        .attr("id", "tooltip3")
        .text("")
        .attr("fill", "white")

    vis.svg.append("text")
        .attr("x", 380)
        .attr("y", 180)
        .attr("id", "tooltip4")
        .text("")
        .attr("fill", "white")

    vis.svg.append("text")
        .attr("x", 380)
        .attr("y", 200)
        .attr("id", "tooltip5")
        .text("")
        .attr("fill", "white")

    vis.svg.append("text")
        .attr("x", 380)
        .attr("y", 220)
        .attr("id", "tooltip6")
        .text("")
        .attr("fill", "white")

    // direction sign
    vis.svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 50)
        .attr("fill", "white")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
    vis.svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", -5)
        .attr("y2", 5)
        .attr("fill", "white")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
    vis.svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 5)
        .attr("y2", 5)
        .attr("fill", "white")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
    vis.svg.append("text")
        .attr("x", 8)
        .attr("y", 10)
        .text("North")
        .attr("fill", "white")
        // .attr("stroke", "white")
}

gridMapVis.prototype.renderGrid = function() {
    var vis = this;
    // grids
    vis.grids = vis.svg.selectAll(".grids")
        .data(d3.range(0, 16, 1))
    vis.grids.enter().append("rect")
        .merge(vis.grids)
        .attr("class", "grids")
        .attr("id", function(d, index) {
            return "grid-" + index;
        })
        .attr("x", function(d) {
            if (vis.grey_out.includes(d)) {
                return -20;
            }
            else {
                // console.log(Math.floor(d/4))
                return 70 * Math.floor(d/4) + 50
            }
        })
        .attr("y", function(d) {
            if (vis.grey_out.includes(d)) {
                return -20;
            }
            else {
                return 70 * (d%4);
            }
        })
        .attr("width", function(d) {
            if (vis.grey_out.includes(d)) {
                return 0;
            }
            else {
                return 50;
            }
        })
        .attr("height", function(d) {
            if (vis.grey_out.includes(d)) {
                return 0;
            }
            else {
                return 50;
            }
        })
        .attr("fill", function(d) {
            if (vis.grey_out.includes(d)) {
                return "black";
            }
            else {
                return "white";
            }
        })
        .attr("opacity", function(d) {
            if (vis.grey_out.includes(d)) {
                return 0;
            }
            else {
                return 1;
            }
        })
    // .on("mouseover", function(d, index) {
    //     filter_radar(index);
    //     vis.updateDiffSingle(index)
    //     // if (vis.diff) {
    //     //     vis.updateDiff();
    //     // }
    //     // else {
    //     //     vis.updateVis();
    //     // }
    //     d3.select("#grid-" + index).style("opacity", 0)
    // })
    // .on("mouseout", function(d, index) {
    //     d3.select("#grid-" + index).style("opacity", 1)
    // })
    vis.grids.exit().remove()

    vis.grid_text = vis.svg.selectAll(".grid-text")
        .data(d3.range(0, 16, 1))
    vis.grid_text.enter().append("text")
        .merge(vis.grid_text)
        .attr("class", "grid-text")
        .attr("id", function(d, index) {
            return "grid-text-" + index;
        })
        .attr("x", function(d) {
            return 77 * Math.floor(d/4) + 65;
        })
        .attr("y", function(d) {
            return 70 * (d%4 + 1) - 5;
        })
        .style("text-anchor", "middle")
        .attr("fill", function(d) {
            if (vis.grey_out.includes(d)) {
                return "black";
            }
            else {
                return vis.diffColor;
            }
        })
        .attr("opacity", 1)
        // .on("mouseover", function(d, index) {
        //     d3.select("#grid-text-" + index).style("opacity", 0)
        // })
        // .on("mouseout", function(d, index) {
        //     d3.select("#grid-text-" + index).style("opacity", 1)
        // })
        .text(function(d) {
            const area = vis.neigh_order[d]
            if (area == "none") {
                return "";
            }
            else if (area == "South Boston Waterfront") {
                return "Waterfront"
            }
            else {
                return area;
            }
        })
        .on("mouseover", function(d, index) {
            filter_radar(vis.neigh_ind[index]);
            const datum = vis.displayData[vis.neigh_ind[index]]
            d3.select("#grid-text-" + index).style("fill", "white")

            d3.select("#tooltip1").text("Neighborhood: ")
            d3.select("#tooltip2").text("" + datum.neightborhood)
            d3.select("#tooltip3").text("Airbnb Rating Total: " + vis.airbnbRating[vis.neigh_ind[index]].total)
            d3.select("#tooltip4").text("Hotel Rating Total: " + vis.hotelRating[vis.neigh_ind[index]].total)
            d3.select("#tooltip5").text("")
            d3.select("#tooltip6").text("")
        })
        .on("mouseout", function(d, index) {
            d3.select("#grid-text-" + index).style("fill", vis.diffColor)

            d3.select("#tooltip1").text("")
            d3.select("#tooltip2").text("")
            d3.select("#tooltip3").text("")
            d3.select("#tooltip4").text("")
            d3.select("#tooltip5").text("")
            d3.select("#tooltip6").text("")
        })
    vis.grid_text.exit().remove();

    vis.updateVis();
}

gridMapVis.prototype.clean_data = function() {
    var vis = this;

    let rm_dp = (names) => names.filter((v,i) => names.indexOf(v) === i)
    vis.unique_neighborhoods = rm_dp(vis.hotel_data.map(function(d){ return d["nei"]; }));

    vis.displayData = [];
    vis.data.forEach(function(d) {
        if  (vis.unique_neighborhoods.includes(d.neightborhood)) {
            vis.displayData.push(d)
        }
    })

    // sort the data and aggregate
    vis.hotel_data.sort(function(a, b) {
        return ('' + a.nei).localeCompare(b.nei);
    })

    vis.displayData.sort(function(a, b) {
        return ('' + a.neightborhood).localeCompare(b.neightborhood);
    })

    vis.displayData.forEach(function(d, index) {
        d["hotel_price"] = vis.hotel_data[index].ave_price;
    })
}

gridMapVis.prototype.updateDiffSingle = function(ind) {
    const vis = this;
    // console.log("DDDDDDDD here")
    // console.log(vis.allDiff[ind])
    if (vis.allDiff[ind]) {
        d3.select("#air-bar-" + ind).attr("opacity", 0);
        const temp = d3.select("#hotel-bar-" + ind)
        // console.log("#hotel-bar-" + ind)
        // console.log(vis.displayData[vis.neigh_ind[ind]])
        temp.attr("fill", vis.diffColor)
            .attr("x", 70 * Math.floor(ind/4) + 70)
            .attr("height", function() {
                const datum  = vis.displayData[vis.neigh_ind[ind]];
                return vis.y(datum.hotel_price - datum.avg_price);
            })
            .attr("fill", vis.diffColor)
            .attr("y", function() {
                const datum  = vis.displayData[vis.neigh_ind[ind]];
                return 70 * (ind%4) + 50 - vis.y(datum.hotel_price - datum.avg_price);
            })
    }
    else {
        d3.select("#air-bar-" + ind).attr("opacity", 1);
        // d3.select("#hotel-bar-" + ind).attr("fill", vis.hotelColor)
        const temp1 = d3.select("#hotel-bar-" + ind)
        temp1.attr("x", 70 * Math.floor(ind/4) + 55)
            .attr("y", function() {
                const datum  = vis.displayData[vis.neigh_ind[ind]];
                return 70 * (ind%4) + 50 - vis.y(datum.hotel_price);
            })
            .attr("height", function() {
                const datum  = vis.displayData[vis.neigh_ind[ind]];
                return vis.y(datum.hotel_price)
            })
            .attr("fill", vis.hotelColor);
    }
    vis.allDiff[ind] = !vis.allDiff[ind];
}


gridMapVis.prototype.updateDiff = function() {
    var vis = this;

    // grid diff bars
    vis.diffBars = vis.svg.selectAll(".gridBars-hotel")
        .data(vis.displayData)
    vis.diffBars.enter()
        .append("rect")
        .merge(vis.diffBars)
        .attr("class", "gridBars-hotel")
        .attr("id", function(d, index) {
            return "hotel-bar-" + vis.neigh_order.indexOf(d.neightborhood);
        })
        .attr("x", function(d, index) {
            const ind = vis.neigh_order.indexOf(d.neightborhood)
            return 70 * Math.floor(ind/4) + 70;
        })
        .attr("y", function(d, index) {
            const ind = vis.neigh_order.indexOf(d.neightborhood)
            return 70 * (ind%4) + 50 - vis.y(d.hotel_price - d.avg_price);
        })
        .attr("width", 15)
        .attr("height", function(d) {
            return vis.y(d.hotel_price - d.avg_price)
        })
        .attr("fill", vis.diffColor);
    vis.diffBars.exit().remove()

    vis.svg.selectAll(".gridBars-air").attr("opacity", 0)


    vis.svg.selectAll(".gridBars-hotel")
    vis.renderCover();
}

gridMapVis.prototype.updateVis = function() {
    var vis = this;

    // vis.neigh_order = ["none", "none", "Charlestown", "East Boston", "none", "West End",
    // "North End", "none", "Back Bay", "Beacon Hill", "Downtown", "South Boston Waterfront",
    // "none", "South End", "South Boston", "none"];

    // grid bars
    vis.hotelBars = vis.svg.selectAll(".gridBars-hotel")
        .data(vis.displayData)
    vis.hotelBars.enter()
        .append("rect")
        .merge(vis.hotelBars)
        .attr("class", "gridBars-hotel")
        .attr("id", function(d, index) {
            return "hotel-bar-" + vis.neigh_order.indexOf(d.neightborhood);
        })
        .attr("x", function(d, index) {
            var ind = vis.neigh_order.indexOf(d.neightborhood)
            return 70 * Math.floor(ind/4) + 55;
        })
        .attr("y", function(d, index) {
            var ind = vis.neigh_order.indexOf(d.neightborhood)
            return 70 * (ind%4) + 50 - vis.y(d.hotel_price);
        })
        .attr("width", 15)
        .attr("height", function(d) {
            return vis.y(d.hotel_price)
        })
        .attr("fill", vis.hotelColor);
    vis.hotelBars.exit().remove()
    vis.airBars = vis.svg.selectAll(".gridBars-air")
        .data(vis.displayData)
    vis.airBars.enter()
        .append("rect")
        .merge(vis.airBars )
        .attr("class", "gridBars-air")
        .attr("id", function(d, index) {
            return "air-bar-" + vis.neigh_order.indexOf(d.neightborhood);
        })
        .attr("x", function(d, index) {
            ind = vis.neigh_order.indexOf(d.neightborhood)
            return 70 * Math.floor(ind/4) + 75;
        })
        .attr("y", function(d, index) {
            ind = vis.neigh_order.indexOf(d.neightborhood)
            return 70 * (ind%4) + 50 - vis.y(d.avg_price);
        })
        .attr("width", 15)
        .attr("height", function(d) {
            return vis.y(d.avg_price)
        })
        .attr("opacity", 1)
        .attr("fill", vis.airbnbColor);
    vis.airBars.exit().remove()
    vis.renderCover();
}

gridMapVis.prototype.updateTrue = function() {
    const vis = this;
    vis.allDiff.forEach(function(d, index) {
        vis.allDiff[index] = true
    })
}

gridMapVis.prototype.updateFalse = function() {
    const vis = this;
    vis.allDiff.forEach(function(d, index) {
        vis.allDiff[index] = false
    })
}


gridMapVis.prototype.renderCover = function() {
    var vis = this;

    // grids
    vis.cover = vis.svg.selectAll(".cover")
        .data(d3.range(0, 16, 1))
    vis.cover.enter().append("rect")
        .merge(vis.cover)
        .attr("class", "cover")
        .attr("id", function(d, index) {
            return "grid-" + index;
        })
        .attr("x", function(d) {
            return 70 * Math.floor(d/4) + 50;
        })
        .attr("y", function(d) {
            return 70 * (d%4);
        })
        .attr("width", function(d) {
            if (vis.grey_out.includes(d)) {
                return 0;
            }
            else {
                return 50;
            }
        })
        .attr("height", 50)
        .attr("fill", "white")
        .attr("opacity", 0)
        .on("mouseover", function(d, index) {
            filter_radar(vis.neigh_ind[index]);
            vis.updateDiffSingle(index)
            // if (vis.diff) {
            //     vis.updateDiff();
            // }
            // else {
            //     vis.updateVis();
            // }
            d3.select("#grid-" + index).style("opacity", 0)

            // tooltip
            const datum = vis.displayData[vis.neigh_ind[index]]
            if (!vis.allDiff[index]) {
                d3.select("#tooltip1").text("Neighborhood: ")
                d3.select("#tooltip2").text("" + datum.neightborhood)
                d3.select("#tooltip3").text("Price Difference: " + (datum.hotel_price - datum.avg_price).toFixed(2))
                d3.select("#tooltip4").text("Airbnb Rating Total: " + vis.airbnbRating[vis.neigh_ind[index]].total)
                d3.select("#tooltip5").text("Hotel Rating Total: " + vis.hotelRating[vis.neigh_ind[index]].total)
                d3.select("#tooltip6").text("")

            }
            else {
                d3.select("#tooltip1").text("Neighborhood: ")
                d3.select("#tooltip2").text("" + datum.neightborhood)
                d3.select("#tooltip3").text("Airbnb Price: " + datum.avg_price.toFixed(2))
                d3.select("#tooltip4").text("Hotel Price: " + datum.hotel_price.toFixed(2))
                d3.select("#tooltip5").text("Airbnb Rating Total: " + vis.airbnbRating[vis.neigh_ind[index]].total)
                d3.select("#tooltip6").text("Hotel Rating Total"  + vis.hotelRating[vis.neigh_ind[index]].total)
            }
        })
        .on("mouseout", function(d, index) {
            d3.select("#grid-" + index).style("opacity", 1)
            d3.select("#tooltip1").text("")
            d3.select("#tooltip2").text("")
            d3.select("#tooltip3").text("")
            d3.select("#tooltip4").text("")
            d3.select("#tooltip5").text("")
            d3.select("#tooltip6").text("")

        })
    vis.cover.exit().remove()
}
