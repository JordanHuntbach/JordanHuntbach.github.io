$(document).ready(
    alert("This page is a work in progress, check back soon for more content :)")
);

function contact(){
    var contact = $("#contact");
    contact.slideDown(50, "linear", function(){
        $('html, body').animate({scrollTop: contact.offset().top}, 'slow');
    });
}