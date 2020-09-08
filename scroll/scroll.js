function fadeIn () {
    // Check the location of the object
    $('.fade-in').each( function(i){

        // Find the location of the objects
        var bottom_of_object = $(this).offset().top + $(this).outerHeight();

        // Find out how far we've scrolled down
        var bottom_of_window = $(window).scrollTop() + $(window).height();

        // If we have scrolled past the bottom of the object,
        // fade it in over 1000ms
        if( bottom_of_window > bottom_of_object ){
            $(this).animate({'opacity':'1'},1000);
        }
    });
}

$(document).ready(function() {
    fadeIn();

    // Whenever the window is scrolled ...
    $(window).scroll( function(){
        fadeIn();
    });
})