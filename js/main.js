var textTypeInterval = 40;
var basePause = 1000;
var slideRun = {2:true, 3:true, 4:true, 5:true, 6:true, 8:true, 10:true};

$(document).ready(function() {
    $('#fullPage').fullpage({
        navigation: true,
        menu: '#main-menu',
        fadingEffect: true,
        verticalCentered: false,
        afterLoad: function(origin, destination, direction) {
            // currentIndex records the page index starting from 0.
            var currentIndex = destination.index;
            console.log(currentIndex);
            if (currentIndex == 2) {
                //console.log(currentIndex);
            }
        }

    });
    // var svg = d3.select("#logo-animation").append("svg")
    //                             .attr("width", 500)
    //                             .attr("height", 500);
    // var myimage = svg.append('image')
    //                 .attr('xlink:href', "img/airbnb-logo.png")
    //                 .attr('width', 400)
    //                 .attr('height', 400)
    // source = "img/airbnb-logo.png";
    // var img = d3.select("#logo-animation").append("img").attr("src", source).style("opacity", 0)
    // img.transition().duration(2000).ease(d3.easeLinear).style("opacity", 1)
    // myimage.transition()
    //        .duration(1000)
    //        .style("opacity", 0.2);

})