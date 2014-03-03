'use strict';
(function(window){
    $('#collapseOne').collapse('hide');
    var searchQuery = ''; //Declare global variable for user's query
    var sort = 'interestingness-desc';
    $('#imageQuery').keyup(function() { //Set searchQuery to value of input field
        searchQuery = $(this).val();
        if (event.keyCode === 13) { // Execute search if user presses enter
            $('#imageSearchButton').click();
        }
    });

    $('.search-option').click(function(){
        sort = $(this).attr('value');
        if(searchQuery != ''){ //If user hasn't entered anything, don't search, otherwise redo the search with new filter
    		$('#imageSearchButton').click();
    	}
    	$('.search-option').parent().removeClass('active');
    	$(this).parent().addClass('active');
        var currentIndicator = $(this).text() + " <span class='caret'>"
        $('.sort-display').html(currentIndicator);
    });

    $(document).on('click', '#imageLink', function(e){ //Trigger when user clicks on an image
        var clickedLink = $(this).attr('href');
        $('.image-entry').val(clickedLink);
        console.log(clickedLink);
    });

    $('#imageSearchButton').click(function() { //Execute search when user clicks button
        $('#collapseOne').collapse('hide');
        $('.justifiedGallery').empty(); //Make #images clear in case user searches multiple times
        var cleanQuery = searchQuery.replace(/\s+/g, '+'); //Replace spaces in the query with +
        var srcLarge;
        var srcSmall;
        var picTitle;
        $.getJSON('http://api.flickr.com/services/rest/', {
            method: 'flickr.photos.search',
			api_key: '68dc576fbfc642f59fdbd1032a6c6475',
            tags: cleanQuery,
			tag_mode: 'all',
            sort: sort,
            extras: 'url_n,url_m,url_z,url_l', //Other pic resolutions
            format: 'json',
			per_page: 150,
			safe_search: 1,
            nojsoncallback: 1
        }, function(data) {
            $.each(data.photos.photo, function(i, item) {
                srcSmall = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
                srcLarge = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_z.jpg'; //Link to larger images for Timeline
                picTitle = item.title;
                console.log(srcSmall);
                $("<a class='image-link' data='" + srcLarge + "' href='" + srcLarge + "' title='" + picTitle + "'><img src='" + srcSmall + "' alt='" + picTitle + "'/></a>").appendTo("#images");
                if (i === 19) {return false;} //Limit to 20 photos per Flickr API
            });
            $('#images').waitForImages(function() { //Wait for images to load before formatting them
                $('#images').justifiedGallery(); //Use justifiedGallery to make images fit together nicely
                $('#collapseOne').collapse("show");
            });
        });
    });
})(window);