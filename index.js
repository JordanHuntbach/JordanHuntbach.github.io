$(document).ready(

);

function contact(){
    var contact = $("#contact");
    contact.slideDown(50, "linear", function(){
        $('html, body').animate({scrollTop: contact.offset().top}, 'slow');
    });
}