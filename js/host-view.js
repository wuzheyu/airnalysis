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

