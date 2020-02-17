// I, Riket Patel, student number 000730183, certify that all code submitted is my own work; that I have not copied it from any other source.  I also certify that I have not allowed my work to be copied by others.

$(document).ready(function(){
    $.ajaxSetup({ cache: false });
    $('#searchBox').keyup(function(){
        $('#suggestionList').html('');
        $('#state').val('');
        var searchField = $('#searchBox').val();
        var expression = new RegExp(searchField, "i");
        for (i in arenaList){
            if (arenaList[i].name.search(expression) != -1 || arenaList[i].address.search(expression) != -1)
            {
                $('#suggestionList').append('<li class="list-group-item link-class">'+ arenaList[i].name+' | <span class="text-muted">'+ arenaList[i].address +'</span> | <span class="text-muted">'+ arenaList[i].community +'</span> | <span class="text-muted d-none">'+ arenaList[i].phone +'</span><span class="text-muted d-none">|'+ arenaList[i].website +'</span> </li>');
            }
        }
    });
    $('#suggestionList').on('click', 'li', function() {
        var click_text = $(this).text().split('|');
        $('#searchBox').val('');
        $("#suggestionList").html('');
        $('#sidebar').addClass('active');
        $('#nameInfo').html(click_text[0]);
        $('#addressInfo').html(click_text[1] + ", " + click_text[2]);
        $('#phoneInfo').html(click_text[3]);
        $('#webinfo').html(click_text[4]);
        $('#webinfo').attr('href',click_text[4]);
    });
});
