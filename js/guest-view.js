queue()
    .defer(d3.csv, "data/bos-listings.csv")
    .defer(d3.csv, "data/ny-listings.csv")
    .defer(d3.csv, "data/boston_review.csv")
    .await(createVisualization);

function createVisualization(error, nyc_contour, nyc_listings) {
    // console.log(nyc_contour);
    // console.log(nyc_listings);
    mapchart = new MapChart("ny-map", {"contour":nyc_contour,"listings":nyc_listings});
}