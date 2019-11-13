$(document).ready(function() {
    $('#fullPage').fullpage();
    // var svg = d3.select("#logo-animation").append("svg")
    //                             .attr("width", 500)
    //                             .attr("height", 500);
    // var myimage = svg.append('image')
    //                 .attr('xlink:href', "img/airbnb-logo.png")
    //                 .attr('width', 400)
    //                 .attr('height', 400)
    source = "img/airbnb-logo.png";
    var img = d3.select("#logo-animation").append("img").attr("src", source).style("opacity", 0)
    img.transition().duration(2000).ease(d3.easeLinear).style("opacity", 1)
    // myimage.transition()
    //        .duration(1000)
    //        .style("opacity", 0.2);

})