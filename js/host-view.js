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
    console.log(nyc_contour);
    // console.log(nyc_listings);
    // mapchart = new MapChart("ny-map", {"contour":nyc_contour,"listings":nyc_listings});

    console.log(air_rental);
    // Convert string to float
    air_rental.forEach(function(d){
        d.rental_price = parseFloat(d.rental_price);
        d.rental_inventory = parseFloat(d.rental_inventory);
        d.airbnb_price = parseFloat(d.airbnb_price);
        d.airbnb_inventory = parseFloat(d.airbnb_inventory);
        d.price_diff = d.airbnb_price - d.rental_price/30;
    });


    choro_ny = new Choropleth("ny-map", nyc_contour, air_rental);
}

function updateChoropleth(){
    choro_ny.updateVis();
}

d3.json("data/variability.json", function(variability){
    var example = variability[3];
    console.log(example);


    var margin = {top: 10, right: 10, bottom: 10, left: 0},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var rect_width = 15, rect_margin = 5;

// --> CREATE SVG DRAWING AREA
    var svg = d3.select("#price-vary").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var color = d3.scaleQuantize()
        .range(d3.range(5).map(function(i) { return d3.interpolateReds((i+1)/5); }))
        .domain([100,150]);

    var grid = svg.selectAll("rect")
        .data(d3.range(365))
        .enter()
        .append("rect")
        .attr("x",function(d){
            return d%20 * (rect_width + rect_margin)
        })
        .attr("y",function(d){
            return Math.floor(d/20) * (rect_width + rect_margin)
        })
        .attr("width",rect_width)
        .attr("height",rect_width)
        .attr('fill',function(d){
            return color(example.price[d])
        })
        .attr('stroke','rgb(3,140,140)')
        .attr('stroke-width',function(d){
            if (example.available[d]=='False'){
                return 3
            } else{return 0}
        })
        .append('title')
        .text(function(d){
            return 'price:'+example.price[d]+'\ndate: '+example.date[d]
        })
})
