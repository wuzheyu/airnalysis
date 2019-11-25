// Load shape of NYC (GeoJSON) and airbnb listings
// Load data parallel
queue()
    // https://github.com/codeforamerica/click_that_hood/blob/master/public/data/new-york-city-boroughs.geojson
    .defer(d3.json, "data/new-york-city-boroughs.geojson")
    // 12 September, 2019 http://insideairbnb.com/get-the-data.html
    .defer(d3.csv, "data/ny-listings.csv")
    .defer(d3.csv, "data/host.csv")
    .await(createVisualization);

var choro_ny;

function createVisualization(error, nyc_contour, nyc_listings, air_rental) {
    // console.log(nyc_contour);
    // console.log(nyc_listings);
    // mapchart = new MapChart("ny-map", {"contour":nyc_contour,"listings":nyc_listings});

    // console.log(air_rental);
    // Convert string to float
    air_rental.forEach(function(d){
        d.rental_price = parseFloat(d.rental_price);
        d.rental_inventory = parseFloat(d.rental_inventory);
        d.airbnb_price = parseFloat(d.airbnb_price);
        d.airbnb_inventory = parseFloat(d.airbnb_inventory);
        d.price_diff = d.airbnb_price - d.rental_price/30;
    });

    choro_ny = new Choropleth("ny-map", nyc_contour, air_rental);
    createSmallMultiples(air_rental, nyc_listings);
}

function updateChoropleth(){
    choro_ny.updateVis();
}

// second vis
d3.json("data/variability.json", function(variability){
    var example = variability[3];
    // first day is friday - remove them so we have weeks starting saturday
    example.available.shift();
    example.date.shift();
    example.price.shift();
    console.log(example);


    var margin = {top: 10, right: 10, bottom: 10, left: 0},
        width =$("#price-vary").width() - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var rect_width = 15, rect_margin = 5;

    var inner_radius = 130, circle_r = 6, circle_margin = 3;

// --> CREATE SVG DRAWING AREA
    var svg = d3.select("#price-vary").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var color = d3.scaleQuantize()
    //     .range(d3.range(5).map(function(i) { return d3.interpolateReds((i+1)/5); }))
    //     .domain([100,150]);
    var domain_upper = 150, domain_lower = 80;
    var color = function(price){
        var p = (price-domain_lower)/(domain_upper-domain_lower);
        // return d3.interpolateRgb.gamma(2.2)("rgb(242,201,204)","rgb(242,87,100)")(p)
        // return d3.interpolateRdPu(p);
        return d3.interpolateReds(p);
    };


    // create circular circles
    var circles = svg.selectAll("circle")
        .data(d3.range(364))
        .enter()
        .append("circle")
        .attr("class","price-circles")
        .attr("cx",function(d){
            var angle = (Math.floor(d/7)+1.5)/54 * 2 * Math.PI - Math.PI; //same week has same angle
            return (inner_radius + (6-d%7) * (circle_r*2+circle_margin)) * Math.cos(angle)+ (width/2)
        })
        .attr("cy",function(d){
            var angle = (Math.floor(d/7)+1.5)/54 * 2 * Math.PI - Math.PI; //same week has same angle
            return (inner_radius + (6-d%7) * (circle_r*2+circle_margin)) * Math.sin(angle)+ (height/2)
        })
        .attr("r",circle_r)
        .attr('fill',function(d){
            return color(example.price[d])
        })
        .attr('stroke','rgb(3,140,140)')
        .attr('stroke-width',function(d){
            if (example.available[d]==='False'){
                return 2
            } else{return 0}
        })
        .append('title')
        .text(function(d){
            return 'price:'+example.price[d]+'\ndate: '+example.date[d]
        })

    // add week labels
    var weekLabels = svg.append("g")
        .attr("id","week-labels")
        .attr("transform","translate("+(width/2-inner_radius+circle_r)+","+ (height/2) +")");

    var weekNames = ["Fri", "Thu","Wed","Tue","Mon","Sun","Sat"];
    weekLabels.selectAll("text")
        .data(weekNames)
        .enter()
        .append("text")
        .attr("transform","rotate(-90)")
        .text(d=>d)
        .attr("y",function(d,i){
            return -(circle_r*2 + circle_margin) * i
        })
        .attr("font-size",12)
        .attr("text-anchor","middle");

    // add month labels
    var monthLabels = svg.append("g")
        .attr("id","month-labels")
        .attr("transform","translate("+(width/2)+","+ (height/2) +")");

    var curr_month = "";

    var parseMonth = d3.timeParse("%Y-%m-%d");
    var formatMonth =d3.timeFormat("%b %Y");
    monthLabels.selectAll("text")
        .data(example.date)
        .enter()
        .append("text")
        .attr("transform",function(d,i){
            var angle = (Math.floor(i/7)+1.5)/54 * 360 - 90;
            return "rotate("+angle+ ")"
        })
        .attr("y", -(inner_radius + 7*(circle_r*2 + circle_margin)))
        .text(function(d,i){
            var mon = formatMonth(parseMonth(d));
            if (i%7 === 0 && mon !== curr_month){
                curr_month = mon;
                return mon
            }else{
                return ""
            }
        })
        .attr("font-size",12)
        .attr("text-anchor","middle");

    // add legend
    var legend = svg.append("g")
        .attr("id","circle-legend")
        .attr("transform","translate("+(width/2-inner_radius-220)+","+ (height/2) +")");

    var num_legend_circles = 6;
    legend.selectAll("circle")
        .data(d3.range(num_legend_circles+1))
        .enter()
        .append("circle")
        .attr("cy",function(d){
            return (circle_r*2+circle_margin) * d
        })
        .attr("r",circle_r)
        .attr("fill",function(d){
            var price = d*(domain_upper-domain_lower)/num_legend_circles+domain_lower;
            return color(price)
        });

    //Add legend text
    legend.selectAll("text")
        .data(d3.range(num_legend_circles+1))
        .enter()
        .append("text")
        .attr("x", 10)
        .attr("y",function(d){
            return (circle_r*2+circle_margin) * d + 5
        })
        .text(function(d){
            var price = d*(domain_upper-domain_lower)/num_legend_circles+domain_lower;
            return "$"+d3.format("d")(price)
        })
        .attr("font-size", 12);

    // legend title
    legend.append("text")
        .attr("x",-circle_r)
        .attr("y",-(circle_r*2+circle_margin))
        .text("Price per night")
        .attr("font-size", 12);

    // Occupancy legend
    legend.append("text")
        .attr("x",-circle_r)
        .attr("y",-(circle_r*2+circle_margin)*5)
        .text("Occupancy")
        .attr("font-size", 12);

    //Add occupancy legend text
    legend.selectAll("text.occupancy")
        .data(["Available","Not Available"])
        .enter()
        .append("text")
        .attr("class","occupancy")
        .attr("x", 10)
        .attr("y",function(d,i){
            return -(circle_r*2+circle_margin) * (4-i) + 5
        })
        .text(d=>d)
        .attr("font-size", 12);

    legend.selectAll("circle.occupancy")
        .data(["Available","Not Available"])
        .enter()
        .append("circle")
        .attr("class","occupancy")
        .attr("cy",function(d,i){
            return -(circle_r*2+circle_margin) * (4-i)
        })
        .attr("r",circle_r)
        .attr("fill",color(domain_lower+10))
        .attr('stroke','rgb(3,140,140)')
        .attr("stroke-width",function(d){
            if(d==="Available"){
                return 0
            }else{return 2}
        });



    // create a grid of squares
    // var grid = svg.selectAll("rect")
    //     .data(d3.range(365))
    //     .enter()
    //     .append("rect")
    //     .attr("x",function(d){
    //         return d%20 * (rect_width + rect_margin)
    //     })
    //     .attr("y",function(d){
    //         return Math.floor(d/20) * (rect_width + rect_margin)
    //     })
    //     .attr("width",rect_width)
    //     .attr("height",rect_width)
    //     .attr('fill',function(d){
    //         return color(example.price[d])
    //     })
    //     .attr('stroke','rgb(3,140,140)')
    //     .attr('stroke-width',function(d){
    //         if (example.available[d]==='False'){
    //             return 3
    //         } else{return 0}
    //     })
    //     .append('title')
    //     .text(function(d){
    //         return 'price:'+example.price[d]+'\ndate: '+example.date[d]
    //     })
})
