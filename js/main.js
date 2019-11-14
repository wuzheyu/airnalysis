var textTypeInterval = 40;
var basePause = 1000;
var airbnbIntroText = "Airbnb is an online platform for offering lodging and tourism experiences. Its recent announcement of planning to go public in 2020, as well as its market value of over $31 billion have made the public wonder its exact business model and the path to success. Over the years, there is an abundance of Airbnb’s data online, and visualizing them is one of the most efficient ways for the public to fully and quickly appreciate Airbnb’s business model. "

$(document).ready(function() {
    $('#fullPage').fullpage({
        navigation: true,
        menu: '#main-menu',
        fadingEffect: true,
        verticalCentered: false,
        afterLoad: function(origin, destination, direction) {
            // currentIndex records the page index starting from 0.
            var currentIndex = destination.index;
            if (currentIndex == 1) {
                var timeDelay = basePause;
                setTimeout(function(){generateText(airbnbIntroText, 'airbnb-description')}, timeDelay);

                timeDelay += 500;
                setTimeout(function(){generateProgressBar("airbnb-logo", "bt")}, timeDelay);
            }
            else if (currentIndex == 2) {

            }
            else if (currentIndex == 3) {

            }
            else if (currentIndex == 4) {

            }
            else if (currentIndex == 5) {

            }
            else if (currentIndex == 6) {

            }
            else { 

            }
        }

    });

})
function generateText(text, elementID) {
    console.log("run")
    document.getElementById(elementID).innerHTML = text;
    var textWrapper = document.querySelector('#' + elementID);
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: false})
    .add({
        targets: '#' + elementID + ' .letter',
        translateX: [40,0],
        translateZ: 0,
        opacity: [0,1],
        duration: 1200,
        delay: (el, i) => 500 + 30 * i
    })
    // .add({
    //     targets: '#' + elementID + ' .letter',
    //     translateX: [0,-30],
    //     opacity: [1,0],
    //     easing: "easeInExpo",
    //     duration: 1100,
    //     delay: (el, i) => 100 + 30 * i
    // });
}

function generateProgressBar(elementID, direction) {
    var image = document.getElementById(elementID);
    Loadgo.init(image,  {'direction': direction});

    triggerLoadEffect();
    function triggerLoadEffect(){
        var progress = 0;
        var myInterval = setInterval(function(){ 
            if(progress == 100){
                return stopInterval();
            }
            progress += 10;
            Loadgo.setprogress(image, progress);
        }, 1000);
    
        function stopInterval(){
            clearInterval(myInterval);
        }
    }
}