//Helper for hiding/showing baseline-grid

$(function(){
    $('#toggles').children().click(function(e){
        var toggles = $(this).attr("id");
        $('html').toggleClass(toggles);
        e.preventDefault();
    });
});
