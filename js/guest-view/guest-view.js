queue()
    .defer(d3.csv, "data/bos-listings.csv")
    // .defer(d3.csv, "data/data-guest/boston_listing_for_vis.csv")
    // .defer(d3.csv, "data/data-guest/boston_review.csv")
    // .defer(d3.csv, "data/data-guest/bos_review_detail.csv")
    // .defer(d3.csv, "data/data-guest/airbnb-ratings.csv")
    .await(createVisualization);

function createVisualization(error, bos_listing) {

// function createVisualization(error, bos_listing, bos_listing_for_vis, boston_review, boston_review_detail, boston_rating) {
    // console.log(bos_listing)
    // console.log(bos_listing_for_vis)
    // console.log(boston_rating)


    // data cleaning
    var listing_by_neighborhood = get_count_by_neighbor(bos_listing);
    var listing_by_neighborhood = reorg_to_array_by_neightbor(listing_by_neighborhood)
    console.log(listing_by_neighborhood)

    /* multiple coordinated views */
    // total count of airbnb homes
    var countVis = new CountVis("count-vis", listing_by_neighborhood);
    // var roomTypeVis = new RoomTypeVis("room-type-vis", listing_by_time);


}

function reorg_to_array_by_neightbor(listing_by_neighborhood) {
    const neighborhoods_in_ob = Object.keys(listing_by_neighborhood)

    var array_list = []
    neighborhoods_in_ob.forEach(function(d) {
        var new_object = listing_by_neighborhood[d]
        new_object["neightborhood"] = d
        array_list.push(new_object);
    })

    return array_list
}

function get_count_by_neighbor(bos_listing) {
    var listing_by_neighbor = {}
    bos_listing.forEach(function(d) {
        var neighbor = d["neighbourhood_cleansed"]

        if (neighbor in listing_by_neighbor) {
            listing_by_neighbor[neighbor]["count"] += 1
            listing_by_neighbor[neighbor]["room_type"].push(d["room_type"])
            listing_by_neighbor[neighbor]["property_type"].push(d["property_type"])
        }
        else {
            var new_object = {}
            new_object["count"] = 1
            new_object["room_type"] = [d["room_type"]]
            new_object["property_type"] = [d["property_type"]]
            listing_by_neighbor[neighbor] = new_object;
        }
    });

    return listing_by_neighbor;
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