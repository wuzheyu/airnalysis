
CountVis = function(_parentElement, _data, _hotel_data){
    this.parentElement = _parentElement;
    this.data = _data;
    // this.eventHandler = _eventHandler;
    this.hotel_data = _hotel_data;
    this.diff = false;
    this.diffColor = "#F25764"
    this.hotelColor = "#73BFBF"
    this.airbnbColor = "#F28D95"

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

CountVis.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 40, right: 0, bottom: 80, left: 40};

    // vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 300 - vis.margin.top - vis.margin.bottom;
    vis.width = 600 - vis.margin.left - vis.margin.right;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("transform", "translate(-100, 0)")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.x = d3.scaleBand()
        .range([0, 350]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.bar_air = vis.svg.append("g")
        .attr("class", "bar-chart");

    // vis.yNeg = d3.scaleLinear()
    //     .range([vis.height, vis.height/2]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y)


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
            return vis.y(d.ave_price);
        });

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
    //
    //     vis.brushGroup = vis.svg.append("g")
    //         .attr("class", "brush")
    //

    // bar graphs

    vis.wrangleData();

}

CountVis.prototype.wrangleData = function(){
    var vis = this;

    this.displayData = this.displayData;

    // Update the visualization
    vis.updateVis();
}

CountVis.prototype.show_diff = function() {
    var vis = this;

    vis.diff = !vis.diff;
    if (!vis.diff) {
        vis.updateVis();
    }
    else {
        vis.updateDiffVis();
    }

    // var bar = vis.svg.select(".bar-chart")
    // bar.selectAll(".airbnb_pbyn").remove()
    // bar.selectAll(".hotel_pbyn").remove()
    // vis.svg.select(".x-axis").remove()
    // vis.svg.select(".y-axis").remove()

    // draw difference vis
    // var diff_vis = new DiffVis("count-vis", vis.displayData, vis.hotel_data, vis.svg, vis.width, vis.height, vis.svg.select(".bar-chart"));
}

CountVis.prototype.updateDiffVis = function() {
    const vis = this;

    vis.diffData = []
    for(var i = 0; i < vis.displayData.length; i++) {
    }

    var bar = vis.svg.select(".bar-chart")
    // bar.selectAll(".airbnb_pbyn").remove()
    bar.selectAll(".hotel_pbyn").remove().transition().duration(1000)
    // vis.svg.select(".x-axis").remove()
    // vis.svg.select(".y-axis").remove()

    // update scales
    var MaxY= d3.max(vis.displayData.map(function(d){ return (-d.avg_price + d.hotel_price); }));
    var MinY= d3.min(vis.displayData.map(function(d){ return (-d.avg_price + d.hotel_price); }));
    // var MaxY_hotel = d3.max(vis.hotel_data.map(function(d){ return d.ave_price; }));
    vis.y.domain([MinY - 10, MaxY + 10]);

    // legend
    var legend = vis.bar_air.selectAll(".legend")
        .data(["Price Difference (Hotel - Airbnb)"])
    legend.enter().append("rect")
        .attr("class", "legend")
        .merge(legend)
        .attr("x", 400)
        .attr("y", 30)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", vis.diffColor)
    legend.exit().remove()

    var text = vis.bar_air.selectAll(".text")
        .data(["Price Difference (Hotel - Airbnb)"])
    text.enter().append("text")
        .attr("class", "text")
        .merge(text)
        .attr("x", 425)
        .attr("y", 42)
        .attr("fill", vis.diffColor)
        .text("Price Difference")
    text.exit().remove()



    // update bars
    var stacked_bars = vis.bar_air.selectAll(".airbnb_pbyn")
        .data(vis.displayData, function(d) {
            // console.log("look at here")
            // console.log(d)
            return d.neightborhood;});
    stacked_bars
        .enter()
        .append("rect")
        .attr("class", "airbnb_pbyn")
        .merge(stacked_bars)
        .transition()
        .attr("x", function(d) {
            return vis.x(d.neightborhood)
        })
        .attr("y", function(d) {
            return vis.y(d.hotel_price - d.avg_price)
        })
        .attr("height", function(d, index) {
            return vis.height - vis.y(d.hotel_price - d.avg_price)
        })
        .attr("width", vis.x.bandwidth())
        .attr("fill", vis.diffColor)
        // .attr("opacity", 0.5)
    stacked_bars.exit().remove()

    vis.svg.select(".y-axis").call(vis.yAxis);

}

// CountVis.prototype.prepareData = function() {
//     var vis = this;
//     vis.displayData.sort(function(a, b) {
//         return ('' + a.nei).localeCompare(b.nei);
//     })
//
//     vis.data.sort(function(a, b) {
//         return ('' + a.neightborhood).localeCompare(b.neightborhood);
//     })
//
//     vis.display_data = []
//     vis.hotel_data.forEach(function(d, index) {
//         var price_diff = d.ave_price - vis.data[index].avg_price;
//         var new_object = {
//             "neigh": d.nei,
//             "price_diff": price_diff
//         }
//         vis.display_data.push(new_object)
//     })
//
//     this.render();
// }



CountVis.prototype.updateVis = function() {
    var vis = this;

    var legend = vis.bar_air.selectAll(".legend")
        .data(["Airbnb Price", "Hotel Price"])
    legend.enter().append("rect")
        .attr("class", "legend")
        .merge(legend)
        .attr("x", 400)
        .attr("y", function(d, index) {
            return 30 + 20 * index;
        })
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", function(d, index) {
            if (index == 0) {
                return vis.hotelColor
            }
            else {
                return vis.airbnbColor
            }
        })
    legend.exit().remove()

    var text = vis.bar_air.selectAll(".text")
        .data(["Airbnb Price", "Hotel Price"])
    text.enter().append("text")
        .attr("class", "text")
        .merge(text)
        .attr("x", 425)
        .attr("y", function(d, index) {
            return 42 + index*20;
        })
        .attr("fill", function(d, index) {
            if (index == 0) {
                return vis.hotelColor
            }
            else {
                return vis.airbnbColor
            }
        })
        .text(function(d, index) {
            if (index == 0) {
                return "Hotel Price"
            }
            else {
                return "Airbnb Price"
            }
        })
    text.exit().remove()


    var MaxY= d3.max(vis.displayData.map(function(d){ return (d.avg_price + d.hotel_price); }));
    // var MaxY_hotel = d3.max(vis.hotel_data.map(function(d){ return d.ave_price; }));
    vis.y.domain([0, MaxY]);

    let rm_dp = (names) => names.filter((v,i) => names.indexOf(v) === i)
    var domain_arr =  rm_dp(vis.displayData.map(function(d){ return d["neightborhood"]; }));

    vis.x.domain(domain_arr);

    var stacked_bars = vis.bar_air.selectAll(".airbnb_pbyn")
        .data(vis.displayData, function(d) {
            return d.neightborhood
        });
    stacked_bars
        .enter()
        .append("rect")
        .attr("class", "airbnb_pbyn")
        .merge(stacked_bars)
        // .transition()
        // .duration(1000)
        .attr("x", function(d) {
            return vis.x(d.neightborhood)
        })
        .attr("y", function(d) {
            return vis.y(d.avg_price)
        })
        .attr("height", function(d) {
            return vis.height - vis.y(d.avg_price)
        })
        .attr("width", vis.x.bandwidth())
        .attr("fill", vis.airbnbColor)
        // .attr("opacity", 0.5)
    stacked_bars.exit().remove()


    var stacked_bars_hotels = vis.bar_air.selectAll(".hotel_pbyn")
        .data(vis.displayData, function(d) {
            return d.neightborhood
        });
    stacked_bars_hotels
        .enter()
        .append("rect")
        .attr("class", "hotel_pbyn")
        .merge(stacked_bars_hotels)
        // .transition()
        // .duration(0.1)
        // .delay(980)
        .attr("x", function(d) {
            return vis.x(d.neightborhood)
        })
        .attr("y", function(d) {
            return vis.y(d.avg_price + d.hotel_price)
        })
        .attr("height", function(d) {
            return vis.height - vis.y(d.hotel_price)
        })
        .attr("width", vis.x.bandwidth())
        .attr("fill", vis.hotelColor)
        // .attr("opacity", 0.5)
    stacked_bars_hotels.exit().remove()

    // vis.timePath
    //     .datum(vis.displayData)
    //     .attr("d", vis.area)
    //     .attr("fill", "darkred")
    //     // .attr("clip-path", "url(#clip)");

    // vis.timePath
    //     .datum(vis.hotel_data)
    //     .attr("d", vis.area_hotel)
    //     .attr("fill", "darkred")

    vis.svg.select(".x-axis").call(vis.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-45)"
        })
    vis.svg.select(".y-axis").call(vis.yAxis);

    // brush
    // vis.brushGroup.call(vis.brush);
}