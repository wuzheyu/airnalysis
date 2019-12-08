queue()
    .defer(d3.csv, "data/bos-listings.csv")
    .defer(d3.csv, "data/bos-hotel-price.csv")
    .defer(d3.csv, "data/ratings-bos.csv")
    .defer(d3.csv, "data/rating-hotel-bos.csv")
    // .defer(d3.csv, "data/data-guest/boston_listing_for_vis.csv")
    // .defer(d3.csv, "data/data-guest/boston_review.csv")
    // .defer(d3.csv, "data/data-guest/bos_review_detail.csv")
    // .defer(d3.csv, "data/data-guest/airbnb-ratings.csv")
    .await(createVisualization);

var countVis;
var radarVis;
var gridVis;
const diffColor = "#F25764"
const hotelColor = "#038C8C"
const airbnbColor = "#F28D95"
const hlColor = "rgb(255,78,87)"

const hlRed = "#F2C9CC"
const hlGreen = "#45D9D9"

function createVisualization(error, bos_listing, bos_hotel_prices, bos_ratings, hotel_ratings) {
// function createVisualization(error, bos_listing, bos_listing_for_vis, boston_review, boston_review_detail, boston_rating) {

    // fill_paragraphs()
    console.log("ratings")
    console.log(bos_ratings)
    console.log("end of ratings")

    /* multiple coordinated views */

    // data cleaning for count-vis
    var listing_by_neighborhood = get_count_by_neighbor(bos_listing);
    var listing_by_neighborhood = reorg_to_array_by_neightbor(listing_by_neighborhood)
    var bos_hotel_prices_by_neighborhood = clean_hotel_prices(bos_hotel_prices)

    // data cleaning for room-type-vis
    var all_room_types = get_room_types(listing_by_neighborhood);
    var listing_by_neigh_types = listing_types(listing_by_neighborhood, all_room_types);

    gridVis = new gridMapVis("grid-map-vis", listing_by_neighborhood, bos_hotel_prices_by_neighborhood, bos_ratings, hotel_ratings);
    // countVis = new CountVis("count-vis", listing_by_neighborhood, bos_hotel_prices_by_neighborhood);
    radarVis = new RadarVis("radar-vis", bos_ratings, hotel_ratings);

    // var roomTypeVis = new RoomTypeVis("room-type-vis", listing_by_neigh_types);
    add_events();
}

function add_events() {
    // show side-by-side or diff vis
    d3.select("#radio-price").on("click", function() {
        gridVis.updateTrue();
        gridVis.updateVis();
    })
    d3.select("#radio-diff").on("click", function() {
        gridVis.updateFalse();
        gridVis.updateDiff();
    })

    // hover over text
    d3.select("#count-left-first").on("mouseover", function() {
        d3.select("#count-left-first").style("color", hlColor)
        // countVis.highlightDT()
        if (!gridVis.allDiff[10]) {
            gridVis.updateDiffSingle(10)
        }
        d3.select("#grid-10").style("fill", hlRed).attr("stroke", "#F25764")
            .attr("stroke-width", 4)
        // d3.select("#hotel-bar-4").style("fill", hlGreen)
    })
    d3.select("#count-left-first").on("mouseout", function() {
        d3.select("#count-left-first").style("color", "white")
        d3.select("#grid-10").style("fill", "rgba(245, 245, 245, 0.8)").attr("stroke", "rgba(245, 245, 245, 0.8)")
            .attr("stroke-width", 0)
        // d3.select("#airbnb-bar-4").style("fill", airbnbColor)
        // d3.select("#hotel-bar-4").style("fill", hotelColor)
    })
    d3.select("#count-left-second").on("mouseover", function() {
        d3.select("#count-left-second").style("color", hlColor)
        if (gridVis.allDiff[6]) {
            gridVis.updateDiffSingle(6)
        }
        d3.select("#grid-6").style("fill", hlRed).attr("stroke", "#F25764")
            .attr("stroke-width", 4)
    })
    d3.select("#count-left-second").on("mouseout", function() {
        d3.select("#count-left-second").style("color", "white")
        d3.select("#grid-6").style("fill", "rgba(245, 245, 245, 0.8)").attr("stroke", "rgba(245, 245, 245, 0.8)")
            .attr("stroke-width", 0)
    })
    d3.select("#count-left-third").on("mouseover", function() {
        d3.select("#count-left-third").style("color", hlColor)
        d3.selectAll(".grids").style("fill", hlRed).attr("stroke", "#F25764")
            .attr("stroke-width", 4)
        gridVis.updateTrue();
        gridVis.updateVis();
    })
    d3.select("#count-left-third").on("mouseout", function() {
        d3.select("#count-left-third").style("color", "white")
        d3.selectAll(".grids").style("fill", "rgba(245, 245, 245, 0.8)").attr("stroke", "rgba(245, 245, 245, 0.8)")
            .attr("stroke-width", 0)
    })
    d3.select("#count-left-fourth").on("mouseover", function() {
        d3.select("#count-left-fourth").style("color", hlColor)
        radarVis.highlight();
    })
    d3.select("#count-left-fourth").on("mouseout", function() {
        d3.select("#count-left-fourth").style("color", "white")
        radarVis.deHighlight();
    })
}

// function fill_paragraphs() {
//     var par = "In egestas erat imperdiet sed euismod. Nibh mauris cursus mattis molestie a iaculis at erat. Pulvinar pellentesque habitant morbi tristique senectus et. Quis vel eros donec ac. Risus at ultrices mi tempus. Phasellus vestibulum lorem sed risus ultricies tristique nulla. Lorem donec massa sapien faucibus et. Amet est placerat in egestas erat imperdiet sed euismod nisi. Leo duis ut diam quam nulla porttitor. Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Pulvinar elementum integer enim neque volutpat. Tristique risus nec feugiat in fermentum posuere urna nec tincidunt. Vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras. Augue ut lectus arcu bibendum. Egestas quis ipsum suspendisse ultrices gravida. Aliquet lectus proin nibh nisl condimentum."
//     // story_sec = d3.select("#guest-story").innerHTML(par)
//     var node = document.createElement("P");                 // Create a <li> node
//     var textnode = document.createTextNode(par);         // Create a text node
//     node.appendChild(textnode);                              // Append the text to <li>
//     document.getElementById("guest-story").appendChild(node);
// }

function clean_hotel_prices(bos_hotel_prices) {
    var hotel_prices_by_neighborhood = [];
    bos_hotel_prices.forEach(function(d) {
        var prices = 0;
        var counts = 0;
        d3.range(1, 5).forEach(function(i) {
            if (d["price" + i] != undefined) {
                prices += +(d["price"+i]);
                counts += 1;
            }
        })

        var new_object = {
            "nei": d.neighborhood,
            "ave_price": prices / counts
        }
        hotel_prices_by_neighborhood.push(new_object)
    })

    return hotel_prices_by_neighborhood;
}

function listing_types(listing_by_neighborhood, all_room_types) {
    listing_by_neighborhood.forEach(function(d) {
        var new_object = {};
        d3.range(0, 4).forEach(function (i) {
            new_object[all_room_types[i]] = 0;
        })
        d.room_type.forEach(function(d2) {
            new_object[d2] += 1;
        })
        d.room_type = new_object;
    })

    return listing_by_neighborhood;
}

function get_room_types(listing_by_neighborhood) {
    // get all room types
    var all_room_types = [];
    listing_by_neighborhood.forEach(function(d) {
        d.room_type.forEach(function(d2) {
            if (!all_room_types.includes(d2)) {
                all_room_types.push(d2)
            }
        })
    })

    return all_room_types;
}

function reorg_to_array_by_neightbor(listing_by_neighborhood) {
    const neighborhoods_in_ob = Object.keys(listing_by_neighborhood)

    var array_list = []
    neighborhoods_in_ob.forEach(function(d) {
        var new_object = listing_by_neighborhood[d]
        new_object["neightborhood"] = d
        new_object["avg_price"] = listing_by_neighborhood[d]["total_prices"] / listing_by_neighborhood[d]["count"]

        array_list.push(new_object);
    })

    return array_list
}

function get_count_by_neighbor(bos_listing) {
    var listing_by_neighbor = {}
    bos_listing.forEach(function(d) {
        var neighbor = d["neighbourhood_cleansed"]
        var price = +d["price"].replace("$", '')

        if (!isNaN(price) && ((d["room_type"] == "Private room")
            // || (d["room_type"] == "Entire home/apt")
        )){
            if (neighbor in listing_by_neighbor) {
                listing_by_neighbor[neighbor]["total_prices"] += price
                listing_by_neighbor[neighbor]["count"] += 1
                listing_by_neighbor[neighbor]["room_type"].push(d["room_type"])
                listing_by_neighbor[neighbor]["property_type"].push(d["property_type"])
            } else {
                var new_object = {}
                new_object["total_prices"] = price
                new_object["count"] = 1
                new_object["room_type"] = [d["room_type"]]
                new_object["property_type"] = [d["property_type"]]
                listing_by_neighbor[neighbor] = new_object;
            }
        }
    });

    return listing_by_neighbor;
}

function show_diff() {
    countVis.show_diff();
}

// function reorg_to_array(listing_by_time) {
//     const time_points = Object.keys(listing_by_time)
//
//     var array_list = []
//     time_points.forEach(function(d) {
//         var new_object = listing_by_time[d]
//         new_object["host_since"] = d
//         array_list.push(new_object);
//     })
//
//     return array_list
// }
//
// function get_count_by_time(bos_listing) {
//     var listing_by_time = {}
//     bos_listing.forEach(function(d) {
//         var host_since = d["host_since"]
//         var parseTime = d3.timeParse("%Y/%m/%d");
//         host_since = parseTime(host_since);
//
//         if (host_since in listing_by_time) {
//             listing_by_time[host_since]["count"] += 1
//             listing_by_time[host_since]["room_type"].push(d["room_type"])
//             listing_by_time[host_since]["neighbourhood"].push(d["neighbourhood"])
//             listing_by_time[host_since]["property_type"].push(d["property_type"])
//         }
//         else {
//             var new_object = {}
//             new_object["count"] = 1
//             new_object["room_type"] = [d["room_type"]]
//             new_object["neighbourhood"] = [d["neighbourhood_cleansed"]]
//             new_object["property_type"] = [d["property_type"]]
//             listing_by_time[host_since] = new_object;
//         }
//     });
//
//     return listing_by_time;
// }

function filter_radar(area) {
    radarVis.updateVis(area);
}