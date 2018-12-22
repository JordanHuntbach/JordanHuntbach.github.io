$(document).ready(
    alert("This page is a work in progress, and largely unavailable at the moment.")
);

function contact(){
    var contact = $("#contact");
    contact.slideDown(50, "linear", function(){
        $('html, body').animate({scrollTop: contact.offset().top}, 'slow');
    });
}