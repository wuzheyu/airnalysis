var textTypeInterval = 40;
var basePause = 100;
var slidesRun = {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true}
var forcePlot;
var timelinePlot;
var airbnbCityGrowthPlot;
var footprintPlot;
var userSelectedTime = 'linksPast';
var airbnbFootprintProgress;
var airbnbAnnualGrowth;
var ppf_timeline;
var progressYearMapping = {1 : "2007", 2: "2008", 3: "2008", 4: "2009", 5 : "2011", 6 : "2012", 7 : "2013", 8 : "2014", 9 : "2014", 10 : "2015", 11 : "2015", 12: "2016", 13 : "2017"};

$(document).ready(function() {
    $('#fullPage').fullpage({
        navigation: true,
        menu: '#main-menu',
        fadingEffect: true,
        verticalCentered: false,
        afterLoad: function(origin, destination, direction) {
            // currentIndex records the page index starting from 0.
            console.log(destination.index)
            var currentIndex = destination.index;
            if (currentIndex == 1) {
                if (slidesRun[currentIndex] == true) { 
                    var timeDelay = basePause;
                    d3.csv("data/airbnb-footprint.csv", function(data) {
                        airbnbFootprintProgress = data
                        airbnbFootprintProgress.forEach(function(d) {
                            d.year = parseDate(d.year);
                            d.lat = +d.lat;
                            d.lon = +d.lon;
                        })
                        footprintPlot = new footprintMap("company-choropleth", airbnbFootprintProgress, [0, 0]);
                    });

                    setTimeout(function(){
                        $(function () {
                            $('#airbnb-description').css('visibility','visible');
                            $('#airbnb-description').textillate({ in: { effect: 'fadeIn', delayScale: .7} });
                        })
                    }, timeDelay);
                    timeDelay += 5000;
                    setTimeout(function(){
                        $(function () {
                            $('#company-choropleth').delay(timeDelay).css('visibility','visible');
                            $('#timeline-plot').delay(timeDelay).css('visibility','visible');
                            $('#airbnb-logo').delay(timeDelay).css('visibility','visible');
                        })
                    }, timeDelay);

                    timeDelay += 500
                    setTimeout(function(){
                        $(function () {
                            $('#timeline-event-box').delay(timeDelay).css('visibility','visible');
                            $('#timeline-event-box').delay(timeDelay).css('overflow-y','scroll');
                        })
                    }, timeDelay);

                    setTimeout(function(){footprintPlot.updateVis()}, timeDelay);
                    setTimeout(function(){generateProgressBar("airbnb-logo", "bt")}, timeDelay);
                    setTimeout(function(){
                        d3.csv("data/airbnb_consumer_share.csv", function(data) {
                            airbnbAnnualGrowth = data
                            airbnbAnnualGrowth.forEach(function(d) {
                                d.year = parseDate(d.year);
                                d.share = +d.share;
                            })
                            timelinePlot = new timelinePlot("timeline-plot", airbnbAnnualGrowth);
                        });
                    }, timeDelay);
 
                    slidesRun[currentIndex] = false;
                }    
            }
            else if (currentIndex == 2) {
                if (slidesRun[currentIndex] == true){
                    
                    var timeDelay = basePause;
                    setTimeout(function() {
                        moveItem('eric-emily-icon', 0, 50, 100)
                    }, timeDelay);
                    // timeDelay += 500;

                    setTimeout(function(){
                        $(function () {
                            $('#eric-emily-p1').css('visibility','visible');
                            $('#eric-emily-p1').textillate({ in: { effect: 'fadeIn', delayScale: .7 } });
                        })
                    }, timeDelay);

                    timeDelay += 2800;
                    setTimeout(function() {moveItem('boston-icon', 0, 50, 100)}, timeDelay);
                    // timeDelay += 500;
                    setTimeout(function(){
                        $(function () {
                            $('#eric-emily-p2').css('visibility','visible');
                            $('#eric-emily-p2').textillate({ initialDelay: 200, in: { effect: 'fadeIn', delayScale: .7 } });
                        })
                    }, timeDelay);

                    timeDelay += 4500;
                    setTimeout(function() {moveItem('question-icon', 0, 50, 100)}, timeDelay);
                    // timeDelay += 300;
                    setTimeout(function(){
                        $(function () {
                            $('#eric-emily-p3').css('visibility','visible');
                            $('#eric-emily-p3').textillate({ initialDelay: 200, in: { effect: 'fadeIn', delayScale: .7 } });
                        })
                    }, timeDelay);

                    slidesRun[currentIndex] = false;
                }
            }
            else if (currentIndex == 3) {
                if (slidesRun[currentIndex] == true) {


                    slidesRun[currentIndex] = false;
                }

            }
            else if (currentIndex == 4) {
                if (slidesRun[currentIndex] == true) {
                    var timeDelay = basePause;
                    setTimeout(function() {moveItem('newyork-icon', 0, 50, 100)}, timeDelay);
                    // timeDelay += 500;

                    setTimeout(function(){
                        $(function () {
                            $('#eric-emily-p4').css('visibility','visible');
                            $('#eric-emily-p4').textillate({ in: { effect: 'fadeIn', delayScale: .7 } });
                        })
                    }, timeDelay);

                    timeDelay += 3000;
                    setTimeout(function() {moveItem('ee-house-icon', 0, 50, 100)}, timeDelay);
                    // timeDelay += 300;
                    setTimeout(function(){
                        $(function () {
                            $('#eric-emily-p5').css('visibility','visible');
                            $('#eric-emily-p5').textillate({ initialDelay: 200, in: { effect: 'fadeIn', delayScale: .7 } });
                        })
                    }, timeDelay);

                    timeDelay += 4500;
                    setTimeout(function() {moveItem('analytics-icon', 0, 50, 100)}, timeDelay);
                    // timeDelay += 300;
                    setTimeout(function(){
                        $(function () {
                            $('#eric-emily-p6').css('visibility','visible');
                            $('#eric-emily-p6').textillate({ initialDelay: 200, in: { effect: 'fadeIn', delayScale: .7 } });
                        })
                    }, timeDelay);

                }
                    slidesRun[currentIndex] = false;

            }
            else if  (currentIndex == 5) {

            }
            else if (currentIndex == 6) {

            }
            else if (currentIndex == 7) {
                if (slidesRun[currentIndex] == true) {
                    var timeDelay = basePause;
                    setTimeout(function() {moveItem('money-icon', 0, 50, 100)}, timeDelay);
                    timeDelay += 500;

                    setTimeout(function(){
                        $(function () {
                            $('#eric-emily-p7').css('visibility','visible');
                            $('#eric-emily-p7').textillate({ in: { effect: 'fadeIn', delayScale: .7 } });
                        })
                    }, timeDelay);

                    timeDelay += 3800;
                    setTimeout(function() {moveItem('hotel-icon', 0, 50, 100)}, timeDelay);
                    timeDelay += 500;
                    setTimeout(function(){
                        $(function () {
                            $('#eric-emily-p8').css('visibility','visible');
                            $('#eric-emily-p8').textillate({ initialDelay: 200, in: { effect: 'fadeIn', delayScale: .7 } });
                        })
                    }, timeDelay);

                    timeDelay += 4500;
                    setTimeout(function() {moveItem('light-icon', 0, 50, 100)}, timeDelay);
                    timeDelay += 300;
                    setTimeout(function(){
                        $(function () {
                            $('#eric-emily-p9').css('visibility','visible');
                            $('#eric-emily-p9').textillate({ initialDelay: 500, in: { effect: 'fadeIn', delayScale: .7 } });
                        })
                    }, timeDelay);
                }
                slidesRun[currentIndex] = false;
            }
            else if (currentIndex == 8) {
                if (slidesRun[currentIndex] == true) {

                    d3.csv("data/airbnb_growth_us_cleaned.csv", function(data) {
                        data.forEach(function(d) {
                            d.Year = parseDate(d.Year);
                            d.Listings = +d.Listings;
                        })
                        airbnbCityGrowthPlot = new airbnbCityGrowthChart('airbnb-growth', data);
                    });
                    slidesRun[currentIndex] = false;
                }
            }
            else if (currentIndex == 9) {
                if (slidesRun[currentIndex] == true) {
                    ppf_timeline = new ppf_timelinePlot('ppf-timeline');
                    d3.json("data/airbnb-hotel-force.json", function(data) {
                        forcePlot = new forceChart('force-airbnb-hotel', data);
                    });
                    $("#past-button").click(function(){
                        userSelectedTime = 'linksPast';
                        forcePlot.updateVis();
                    });
                    
                    $("#present-button").click(function(){
                        userSelectedTime = 'linksPresent';
                        forcePlot.updateVis();
                    });
                    
                    $("#future-button").click(function(){
                        userSelectedTime = 'linksFuture';
                        forcePlot.updateVis();
                    });
                    slidesRun[currentIndex] = false;
                }

            }
            else if (currentIndex == 10) {
                if (slidesRun[currentIndex] == true) {

                }

            }
            else { 

            }
        }

    });

})

function generateProgressBar(elementID, direction) {
    var image = document.getElementById(elementID);
    Loadgo.init(image,  {
        'opacity':  1,
        'image':    'img/airbnb-logo-white.png',
        'direction': direction
    });

    triggerLoadEffect();

    function triggerLoadEffect(){
        $("#timeline-event-box").css("margin-top", "40px");
        $("#timeline-event-box").css("border-style", "solid");
        $("#timeline-event-box").css("border-color", "rgb(255,78,87)");
        $("#timeline-event-box").css("font-family", "Montserrat, sans-serif");

        var progress = 1;
        var newsQueue = airbnbFootprintProgress;
        var myInterval = setInterval(function(){ 
            if (progress <= 13) {
                var displayEvent = newsQueue.shift(); 
                $("#timeline-event-box").append('<span style="color: rgb(255,78,87); margin:5px"><b>' + formatDate(displayEvent.year) + "</b></span>: "+ displayEvent.event+ ".</br></br>")
                var elem = document.getElementById('timeline-event-box');
                elem.scrollTop = elem.scrollHeight;
            }
            else{
                return stopInterval();
            }
            Loadgo.setprogress(image, 8 * progress > 100 ? 100 : 8 * progress);
            progress += 1;
            
        }, 1200);
    
        function stopInterval(){
            clearInterval(myInterval);
        }
    }
}

function moveItem(elementId, startPosition, endPosition, timeInterval) {

    var distance = endPosition - startPosition;
    var distanceMoved = 0;
    var moveIncrement = distance / timeInterval;

    var item = document.getElementById(elementId);
    var itemPosition = startPosition;

    item.style.left = itemPosition + 'px';
    item.style.display = 'inline';

    var moveIcon = setInterval(function() {
        itemPosition += moveIncrement;
        distanceMoved += moveIncrement;
        item.style.left = itemPosition + 'px';
        if (Math.abs(distanceMoved) >= Math.abs(distance)) {
            clearInterval(moveIcon);
        }
    }, 1);
    $('#' + elementId).css('visibility','visible');

}