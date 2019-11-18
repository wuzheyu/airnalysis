var textTypeInterval = 40;
var basePause = 1000;
// var ericAndEmilyP1 = "Eric is a hotel manager in New York and he recently got married to Emily. "
// var ericAndEmilyP2 = "They would like to travel to Boston for a short trip. They would like to try out Airbnb as one of their friends recommended it."

$(document).ready(function() {
    $('#fullPage').fullpage({
        navigation: true,
        menu: '#main-menu',
        fadingEffect: true,
        verticalCentered: false,
        afterLoad: function(origin, destination, direction) {
            // currentIndex records the page index starting from 0.
            //console.log(direction)
            var currentIndex = destination.index;
            if ((currentIndex == 1) && (direction == "down")) {
                var timeDelay = basePause;
                setTimeout(function(){
                    $(function () {
                        $('#airbnb-description').css('visibility','visible');
                        $('#airbnb-description').textillate({ in: { effect: 'fadeInLeftBig' } });
                    })
                }, timeDelay);

                timeDelay += 500;
                setTimeout(function(){generateProgressBar("airbnb-logo", "bt")}, timeDelay);
            }
            else if ((currentIndex == 2) && (direction == "down")) {
                var timeDelay = basePause;
                setTimeout(function(){
                    //generateText(ericAndEmilyP1, 'eric-emily-p1')
                    $(function () {
                        $('#eric-emily-p1').css('visibility','visible');
                        $('#eric-emily-p1').textillate({ in: { effect: 'fadeInLeftBig' } });
                    })
                }, timeDelay);

                timeDelay += 500;
                setTimeout(function(){
                    $(function () {
                        $('#eric-emily-p2').css('visibility','visible');
                        $('#eric-emily-p2').textillate({ in: { effect: 'fadeInLeftBig' } });
                    })
                }, timeDelay);

                
            }
            else if (currentIndex == 3) {

            }
            else if (currentIndex == 4) {

            }
            else if (currentIndex == 5) {

            }
            else if (currentIndex == 6) {

            }
            else if (currentIndex == 7) {

            }
            else { 

            }
        }

    });

})
function generateText(text, elementID) {
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