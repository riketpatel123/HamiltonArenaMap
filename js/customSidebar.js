// I, Riket Patel, student number 000730183, certify that all code submitted is my own work; that I have not copied it from any other source.  I also certify that I have not allowed my work to be copied by others.
$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });
    $('[data-toggle="popover"]').popover({
        placement : 'bottom'
    });
    $('#dismiss').on('click', function () {
        $('#sidebar').removeClass('active');
    });
    $('#myMap').on('click', function(){
        $('#sidebar').removeClass('active');
        $('#searchBox').val('');
        $("#suggestionList").html('');
        $('.info').html('');
    });
    $('.content').on('click', function(){
        $('#searchBox').val('');
        $("#suggestionList").html('');
    });
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        $("div").removeAttr("data-draggable");
    });
});
