var selectedDist = "Manhattan"
var smallMultiples;

SmallMultiples = function(_parentElement, _origData){
    this.parentElement = _parentElement;
    this.origData = _origData;
    // this.listingData = _listingData
    // this.selectedDist = "Queens"

    this.rentalColor = "#038C8C";
    this.airbnbColor = "#F28D95";
    this.diffColor = "gray";
    this.marginTopDown = 40;

    this.initVis();
};


SmallMultiples.prototype.initVis = function(){
    const vis = this;

    var width = $("#"+vis.parentElement).width();
    // svg area
    vis.margin = { top: 130, right: 50, bottom: 100, left: 105 };
    vis.width = width - vis.margin.left - vis.margin.right;
    vis.height = 350 - vis.margin.top - vis.margin.bottom;
    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("transform", "translate(-20, 0)")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // scales
    vis.x1 = d3.scaleBand()
        .range([0, vis.width/2])
        .padding(.2);

    vis.x2 = d3.scaleBand()
        .range([0, vis.width/2])
        .padding(.2);

    vis.x3 = d3.scaleBand()
        .range([0, vis.width/2])
        .padding(.2);

    vis.x4 = d3.scaleBand()
        .range([0, vis.width/2])
        .padding(.2);

    vis.y1 = d3.scaleLinear()
        .range([vis.height/2, 0]);
    vis.y2 = d3.scaleLinear()
        .range([vis.height/2, 0]);
    vis.y3 = d3.scaleLinear()
        .range([vis.height/2, 0]);
    vis.y4 = d3.scaleLinear()
        .range([vis.height/2, 0]);

    vis.xAxis1 = d3.axisBottom()
        .scale(vis.x1);
    vis.xAxis2 = d3.axisBottom()
        .scale(vis.x2);
    vis.xAxis3 = d3.axisBottom()
        .scale(vis.x3);
    vis.xAxis4 = d3.axisBottom()
        .scale(vis.x4);

    vis.yAxis1 = d3.axisLeft()
        .scale(vis.y1)
        // .ticks(5);
    vis.yAxis2 = d3.axisLeft()
        .scale(vis.y2)
        // .ticks(8);
    vis.yAxis3 = d3.axisLeft()
        .scale(vis.y3)
        // .ticks(8);
    vis.yAxis4 = d3.axisLeft()
        .scale(vis.y4)
        // .ticks(8);

    vis.svg.append("g")
        .attr("class", "x1-axis axis")
        .attr("transform", "translate(" + -40 + "," + (-40 + vis.height/2) + ")")
    // vis.svg.select(".x1-axis").append("text").text("Room Types")
    //     .attr("x", vis.width/2 - 20)
    //     .attr("fill", "black")
    //     .attr("y", vis.height/2+ 40)
    //     .attr("transform", "rotate(45)");
    vis.svg.append("g")
        .attr("class", "x2-axis axis")
        .attr("transform", "translate(" + -40 + "," + (40 + vis.height) + ")");
    // vis.svg.select(".x2-axis").append("text").text("Room Types")
    //     .attr("x", vis.width/2 - 20)
    //     .attr("fill", "black")
    //     .attr("y", vis.height/2+ 40)
    //     .attr("transform", "rotate(45)");
    vis.svg.append("g")
        .attr("class", "x3-axis axis")
        .attr("transform", "translate(" + (40 + vis.width/2)  + "," + (-40 + vis.height/2) + ")");
    // vis.svg.select(".x3-axis").append("text").text("Room Types")
    //     .attr("x", vis.width/2 - 20)
    //     .attr("fill", "black")
    //     .attr("y", vis.height/2+ 40)
    //     .attr("transform", "rotate(45)");
    vis.svg.append("g")
        .attr("class", "x4-axis axis")
        .attr("transform", "translate(" + (40 + vis.width/2) + "," + (40 + vis.height) + ")");
    // vis.svg.select(".x4-axis").append("text").text("Room Types")
    //     .attr("x", vis.width/2 - 20)
    //     .attr("fill", "black")
    //     .attr("y", vis.height/2 + 40)
    //     .attr("transform", "rotate(45)");

    vis.svg.append("g")
        .attr("class", "y1-axis axis")
        .attr("transform", "translate(" + -40 + "," + "-40)");
    vis.svg.select(".y1-axis").append("text").text("Prices")
        .attr("x", 1)
        .attr("fill", "black")
        .attr("y", -10);
    vis.svg.append("g")
        .attr("class", "y2-axis axis")
        .attr("transform", "translate(" + -40 + "," + (vis.height/2 + 40) +  ")");
    vis.svg.select(".y2-axis").append("text").text("Inventory")
        .attr("x", 1)
        .attr("fill", "black")
        .attr("y", -10);
    vis.svg.append("g")
        .attr("class", "y3-axis axis")
        .attr("transform", "translate(" + (40 + vis.width/2)  + ", -40)");
    vis.svg.select(".y3-axis").append("text").text("Price Differences")
        .attr("x", 1)
        .attr("fill", "black")
        .attr("y", -10);
    vis.svg.append("g")
        .attr("class", "y4-axis axis")
        .attr("transform", "translate(" + (40 + vis.width/2)  + "," + (vis.height/2 + 40) + ")");
    vis.svg.select(".y4-axis").append("text").text("Inventory Differences")
        .attr("x", 1)
        .attr("fill", "black")
        .attr("y", -10);

    // legend
    vis.legend = vis.svg.append("g").attr("class","bar-legend")
        .attr("transform","translate("+(-46)+",10)");
    vis.legend.append('rect')
        .attr("x", -40)
        .attr('y', -100)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", vis.airbnbColor)
    vis.legend.append('text')
        .text("Airbnb")
        .attr("fill", vis.airbnbColor)
        .attr("x", -25)
        .attr('y', -90)
    vis.legend.append('rect')
        .attr("x", 35)
        .attr('y', -100)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", vis.rentalColor)
    vis.legend.append('text')
        .text("Rental")
        .attr("fill", vis.rentalColor)
        .attr("x", 50)
        .attr('y', -90)
    vis.legend.append('rect')
        .attr("x", 110)
        .attr('y', -100)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", vis.diffColor)
    vis.legend.append('text')
        .text("Difference")
        .attr("fill", vis.diffColor)
        .attr("x", 125)
        .attr('y', -90)
    vis.legend.append('text')
        .text("*Hover over map to switch borough")
        .style("font-size", 10)
        .attr("fill", vis.airbnbColor)
        .attr("x", 210)
        .attr('y', -90)

    // title
    vis.title = vis.svg.append('text')
        .attr("id","multiples-title")
        .attr("x", -87)
        .attr("y",-110)
        // .attr("fill","whitesmoke")

    // update data
    vis.wrangleData();
}

SmallMultiples.prototype.wrangleData = function() {
    const vis = this;

    console.log("small multiples data")
    console.log(vis.origData)
    console.log("end of displaying data")

    var filteredData = [];
    vis.origData.forEach(function(d) {
        if ((d.Borough == selectedDist)
            && (d.type != "All")
        ) {
            filteredData.push(d)
        }
    });

    vis.displayData = filteredData;

    console.log(vis.displayData)
    vis.updateVis();
}


SmallMultiples.prototype.updateVis = function() {
    const vis = this;

    var MaxAirPrice= d3.max(vis.displayData.map(function(d){ return (d.airbnb_price); }));
    var MaxRentPrice= d3.max(vis.displayData.map(function(d){ return (d.rental_price/30); }));
    // var MaxY_hotel = d3.max(vis.hotel_data.map(function(d){ return d.ave_price; }));
    const max1 = Math.max(MaxAirPrice, MaxRentPrice)
    vis.y1.domain([0, max1 * 1.2]);

    var MaxAirInven= d3.max(vis.displayData.map(function(d){ return (d.airbnb_inventory); }));
    var MaxRentInven= d3.max(vis.displayData.map(function(d){ return (d.rental_inventory); }));
    const max2 = Math.max(MaxAirInven, MaxRentInven)
    vis.y2.domain([0, max2 * 1.2]);

    var MaxPriceDiff= d3.max(vis.displayData.map(function(d){ return (d.price_diff); }));
    vis.y3.domain([0, MaxPriceDiff * 1.5]);

    var MaxInventDiff= d3.max(vis.displayData.map(function(d){ return (d.rental_inventory - d.airbnb_inventory); }));
    var MinInventDiff= d3.min(vis.displayData.map(function(d){ return (d.rental_inventory - d.airbnb_inventory); }));
    if (MinInventDiff < 0) {
        vis.y4.domain([MinInventDiff * 1.2, MaxInventDiff * 0.8]);
    } else {
        vis.y4.domain([0, MaxInventDiff * 1.2]);
    }
    console.log(vis.y4.domain())

    const x_domain_arr = ["Studio", "OneBd", "TwoBd", "ThreePlusBd"];
    const graph_types = ["Price", "Inventory", "Price Diff", "Inventory Diff"];
    // let rm_dp = (names) => names.filter((v,i) => names.indexOf(v) === i)
    // var domain_arr =  rm_dp(vis.displayData.map(function(d){ return d["Borough"]; }));
    // vis.x1.domain(domain_arr);
    vis.x1.domain(x_domain_arr)
    vis.x2.domain(x_domain_arr)
    vis.x3.domain(x_domain_arr)
    vis.x4.domain(x_domain_arr)

    // append groups
    // vis.groups = vis.svg.selectAll(".bar-groups")
    //     .data(vis.displayData)
    // vis.groups.enter().append('g')
    //     .attr("class", "bar-groups")
    //     .merge(vis.groups)
    //     .attr("transform",  function(d, index) {
    //         return "translate(" +  vis.x1(x_domain_arr[index])  + "," + vis.height/2 + ")"
    //     });
    // vis.groups.exit().remove()

    // append bars
    // var groups = vis.svg.selectAll(".bar-groups")

    /*   Price Bar Chart  */
    var bar1 = vis.svg.selectAll(".airbnbPrice")
        .data(vis.displayData)
    bar1.enter()
        .append("rect")
        .attr("class", "airbnbPrice")
        .merge(bar1)
        .transition()
        .duration(1000)
        .style("fill", vis.airbnbColor)
        .attr("x", function(d) {
            return vis.x1(d.type) + 1
        })
        .attr("y", function(d) {
            return vis.y1(d.airbnb_price)
        })
        .attr("transform",  function(d, index) {
            return "translate(-40,-40)"
        })
        .attr("width", vis.x1.bandwidth()/2)
        .attr("height", function(d) {
            return vis.height/2 - vis.y1(d.airbnb_price)
        });
    bar1.exit().remove()

    var bar11 = vis.svg.selectAll(".rentalPrice")
        .data(vis.displayData)
    bar11.enter()
        .append("rect")
        .attr("class", "rentalPrice")
        .merge(bar11)
        .transition()
        .duration(1000)
        .style("fill", vis.rentalColor)
        .attr("transform",  function(d, index) {
            return "translate(-40, -40)";
        })
        .attr("x", function(d) {
            return vis.x1(d.type) + vis.x1.bandwidth()/2 + 1;
        })
        .attr("y", function(d) {
            return vis.y1(d.rental_price/30)
        })
        .attr("width", vis.x1.bandwidth()/2)
        .attr("height", function(d) {
            return vis.height/2 - vis.y1(d.rental_price/30)
        });
    bar11.exit().remove()

    // /*   Price Bar Chart  */
    // var bar1 = vis.svg.selectAll(".airbnbPrice")
    //     .data(vis.displayData)
    // bar1.enter()
    //     .append("rect")
    //     .attr("class", "airbnbPrice")
    //     .merge(bar1)
    //     .style("fill", vis.airbnbColor)
    //     .attr("x", function(d) {
    //         return vis.x1(d.type) + 1
    //     })
    //     .attr("y", function(d) {
    //         // console.log("price here airbnb")
    //         // console.log(d.airbnb_price)
    //         // console.log(vis.y1(d.airbnb_price))
    //
    //         return vis.y1(d.airbnb_price)
    //     })
    //     .attr("width", vis.x1.bandwidth()/2)
    //     .attr("height", function(d) {
    //         return vis.height/2 - vis.y1(d.airbnb_price)
    //     });
    // bar1.exit().remove()
    //
    // var bar11 = vis.svg.selectAll(".rentalPrice")
    //     .data(vis.displayData)
    // bar11.enter()
    //     .append("rect")
    //     .attr("class", "rentalPrice")
    //     .merge(bar1)
    //     .style("fill", vis.rentalColor)
    //     .attr("x", function(d) {
    //         return vis.x1(d.type) + vis.x1.bandwidth()/2 + 1;
    //     })
    //     .attr("y", function(d) {
    //         return vis.y1(d.rental_price/30)
    //     })
    //     .attr("width", vis.x1.bandwidth()/2)
    //     .attr("height", function(d) {
    //         console.log("rental here")
    //         console.log(vis.x1(d.type) + vis.x1.bandwidth()/2 + 1)
    //         console.log(vis.y1(d.rental_price/30))
    //         console.log(vis.height/2 - vis.y1(d.rental_price/30))
    //         return vis.height/2 - vis.y1(d.rental_price/30)
    //     });
    // bar11.exit().remove()


    /*   Inventory Bar Chart  */
    var bar2 = vis.svg.selectAll(".airbnbInvent")
        .data(vis.displayData)
    bar2.enter()
        .append("rect")
        .attr("class", "airbnbInvent")
        .merge(bar2)
        .transition()
        .duration(1000)
        .style("fill", vis.airbnbColor)
        .attr("x", function(d) {
            return vis.x2(d.type) + 1
        })
        .attr("y", function(d) {
            return vis.y2(d.airbnb_inventory)
        })
        .attr("transform",  function(d, index) {
            return "translate(-40"  + "," + (vis.height/2 + 40) + ")"
        })
        .attr("width", vis.x2.bandwidth()/2)
        .attr("height", function(d) {
            return vis.height/2 - vis.y2(d.airbnb_inventory)
        });
    bar2.exit().remove()

    var bar21 = vis.svg.selectAll(".rentalInvent")
        .data(vis.displayData)
    bar21.enter()
        .append("rect")
        .attr("class", "rentalInvent")
        .merge(bar21)
        .transition()
        .duration(1000)
        .style("fill", vis.rentalColor)
        .attr("transform",  function(d, index) {
            return "translate(-40"  + "," + (vis.height/2 + 40) + ")"
        })
        .attr("x", function(d) {
            return vis.x2(d.type) + vis.x2.bandwidth()/2 + 1;
        })
        .attr("y", function(d) {
            return vis.y2(d.rental_inventory)
        })
        .attr("width", vis.x2.bandwidth()/2)
        .attr("height", function(d) {
            return vis.height/2 - vis.y2(d.rental_inventory)
        });
    bar21.exit().remove()


    /*   Price Diff Bar Chart  */
    vis.bar3 = vis.svg.selectAll(".priceDiff")
        .data(vis.displayData);
    vis.bar3.enter()
        .append("rect")
        .attr("class", "priceDiff")
        .merge(vis.bar3)
        .style("fill", vis.diffColor)
        .style("stroke", vis.rentalColor)
        .transition()
        .duration(1000)
        .attr("x", function(d) {
            return vis.x3(d.type) + 1;
        })
        .attr("y", function(d) {
            return vis.y3(d.price_diff);
        })
        .attr("transform",  function(d, index) {
            return "translate(" + (40 + vis.width/2)  + "," + "-40)";
        })
        .attr("width", vis.x3.bandwidth())
        .attr("height", function(d) {
            return vis.height/2 - vis.y3(d.price_diff);
        });
    vis.bar3.exit().remove();

    /*   Inventory Diff Bar Chart  */
    var bar4 = vis.svg.selectAll(".inventDiff")
        .data(vis.displayData);
    bar4.enter()
        .append("rect")
        .attr("class", "inventDiff")
        .merge(bar4)
        .style("fill", vis.diffColor)
        .style("stroke", vis.rentalColor)
        .transition()
        .duration(1000)
        .attr("x", function(d) {
            return vis.x4(d.type) + 1;
        })
        .attr("y", function(d) {
            return vis.y4(d.rental_inventory - d.airbnb_inventory);
        })
        .attr("transform",  function(d, index) {
            return "translate(" + (40 + vis.width/2)  + "," + (vis.height/2 + 40) + ")";
        })
        .attr("width", vis.x4.bandwidth())
        .attr("height", function(d) {
            return vis.height/2 - vis.y4(d.rental_inventory - d.airbnb_inventory);
        });
    bar4.exit().remove();



    vis.svg.select(".x1-axis").call(vis.xAxis1)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-45)"
        })
    vis.svg.select(".x2-axis").call(vis.xAxis2)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-45)"
        })
    vis.svg.select(".x3-axis").call(vis.xAxis3)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-45)"
        })
    vis.svg.select(".x4-axis").call(vis.xAxis4)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-45)"
        })
    vis.svg.select(".y1-axis").call(vis.yAxis1.ticks(4));
    vis.svg.select(".y2-axis").call(vis.yAxis2.ticks(4));
    vis.svg.select(".y3-axis").call(vis.yAxis3.ticks(4));
    vis.svg.select(".y4-axis").call(vis.yAxis4.ticks(4));

    // update title
    vis.title
        .text("Price and Inventory by room type in "+selectedDist+"*");

}


function show_small_multiples(unit_data) {
    console.log(unit_data.properties.neighbourhood_group);
    if (unit_data.properties.name){
        selectedDist = unit_data.properties.name;
    }else{
        selectedDist = unit_data.properties.neighbourhood_group;
    }
    smallMultiples.wrangleData();
}

function createSmallMultiples(air_rental) {
    smallMultiples = new SmallMultiples("small-multiples", air_rental);
}
