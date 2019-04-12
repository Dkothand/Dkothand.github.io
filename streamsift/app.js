//============================================================================
// Solution for using ajax instead of unirest
// https://mashape.groovehq.com/knowledge_base/categories/consume-an-api/topics
// Key is to pass API key into setRequestHeader in beforeSend function
// I think it does the same thing as unirest.get().header("API Key here")

// Link for more reading into getting unirest to work
// https://stackoverflow.com/questions/19059580/client-on-node-uncaught-referenceerror-require-is-not-defined
// https://www.youtube.com/watch?v=G3soxqHAEd8
//============================================================================
// test url :"https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=bojack&country=uk"
/**************************************/

// API url and Key
const apiURL = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup";
const apiKey = "52122fb71bmsh21d596050a233b7p18b88ajsnf76ae4c3d8e5";

// Placeholder image for when returned content is missing image
const imageNotFound = "https://dubsism.files.wordpress.com/2017/12/image-not-found.png";

// Save country selection
let countryBtn = '';

// Empties .container div, clears input text box, clears localStorage cache
const resetFields = () => {
    localStorage.clear();
    $('.container').empty();
    $('input[type=text]').val('');
}


// Get array of localStorage keys
const retrieveStorage = () => {
    const keys = Object.keys(localStorage);

    for (let key of keys) {
        const item = localStorage.getItem(key)
        const $cardDiv = $('<div>').attr('class', 'card');
        $cardDiv.append(item);
        $('.container').append($cardDiv);
    }
}


// Saves created .card div to localStorage
// Takes id from content object and content object as arguments
const saveToLocalStorage = (key, object) => {
    const objectString = object.html();
    localStorage.setItem(key, objectString);
}


// Functions for opening/closing modals
// passes event and checks link id, opens corresponding modal
// Can be refactored, find connection between $('.modal).eq() and link id
const showModal = (event) => {
    event.preventDefault();
    if (event.target.id === 'about') {
        $('.modal').eq(0).css('display', 'block');
    } else if (event.target.id === 'contact') {
        $('.modal').eq(1).css('display', 'block');
    }
}


const hideModal = () => {
    $('.modal').css('display', 'none');
}
// end modal functions


// Display header if search returned content or not
const renderSearchHeader = (array) => {
    if (array.length) {
        $('.results').text('Here\'s what we found for you');
        $('.results').css('display', 'block');
    } else {
        $('.results').text('No results for that search.');
        $('.results').css('display', 'block');
    };
}


// Creates img tag and attributes, passes stock image if no image link found
const $makeImg = (name, url) => {
    const $newImg = $('<img>')
    if (url) {
    $newImg.attr('src', url)
        .attr('alt', name);
    } else {
        $newImg.attr('src', imageNotFound)
            .attr('alt', 'Image not found')
    }
    return $newImg;
}


const $makeDiv = (className) => {
    const $newDiv = $('<div>');
    $newDiv.attr('class', className);
    return $newDiv;
}


// Make <ul> of <li><a> stream names and links
const $makeStreamList = (array) => {
    const $newList = $('<ul>');
    for (let stream of array) {
        const streamName = stream.display_name;
        const streamURL = stream.url;
        const $aStreamLink = $('<a>').attr('href', streamURL)
            .attr('target', '_blank')
            .text(streamName);
        const $listItem = $('<li>').append($aStreamLink);            
        $newList.append($listItem);
    }
    return $newList;
}


// Renders media data to the DOM
const parseData = (results) => {
    // Clear previous search results
    resetFields();
    
    // Check if results array is empty, render msg to DOM
    renderSearchHeader(results)
    
    // Each render each object in results array to DOM
    for (let content of results) {
        const contentName = content.name; // name
        const contentImg = content.picture; // image link
        const locations = content.locations; // streams array

        //id for localStorage key
        const id = content.id;
        
        // Create div .card container for content
        const $cardDiv = $makeDiv('card');
        $cardDiv.append(`<h5>${contentName}</h5>`);

        // Build image div with content image
        const $img = $makeImg(contentName, contentImg);
        const $imgDiv = $makeDiv('content-img');
        $imgDiv.append($img);
        $cardDiv.append($imgDiv);

        // Build div that toggles with .card on.click()
        const $hiddenDiv = $makeDiv('card-back');

        // Build <ul> of stream names and links
        const $ulStreamLinks = $makeStreamList(locations)

        $hiddenDiv.append($ulStreamLinks);
        $cardDiv.append($hiddenDiv);

        // Save jQuery object to localStorage
        saveToLocalStorage(id, $cardDiv);

        // Append jQuery content object to body
        $('.container').append($cardDiv);
    }
}


// AJAX request with user search parameters
const getApiData = () => {

    // Get user input
    const $searchTerm = $('input[type=text]').val();

    $.ajax({
        url: apiURL,
        type: 'GET',
        dataType: "json",
        data: {
            term: $searchTerm,
            country: countryBtn || "us"
        },
        beforeSend: (xhr) => {
            xhr.setRequestHeader(
                "X-RapidAPI-Key", apiKey
            );
        }
    }).then((data) => {
        // results property has media content
        parseData(data.results);
    }, (error) => {
        console.error(error);
    })
}

$(() => {

    // Render localStorage items to DOM
    retrieveStorage();

    // Listener for search button click
    $('button[type=submit]').on('click', getApiData);

    // Listener for Enter key keypress on search box
    $('input[type=text]').keypress((event) => {
        if(event.which === 13) {
            getApiData();
        }
    });

    // Listener for country button click
    $('button').on('click', (event) => {
        countryBtn = event.target.id;
    })

    // Listener for clicking generated content cards, toggles .card-back list of stream links
    $('body').on('click', '.card', (event) => {
        const $contentCard = $(event.currentTarget).children().eq(2);
        $contentCard.toggle();
    });

    // Listener for scroll, change navbar color
    /* From stackover flow: https://stackoverflow.com/questions/23706003/changing-nav-bar-color-after-scrolling*/
    $(document).scroll(() => {
        const $nav = $('.nav-bar');
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    })

    // Slow scroll on #brand click in navbar, https://stackoverflow.com/questions/8579643/how-to-scroll-up-or-down-the-page-to-an-anchor-using-jquery
    $('#brand').on('click', (event) => {
        event.preventDefault();
        $('html, body').animate({scrollTop:0}, 'slow');
    });

    // Open modal on link click
    $('a[href="#"]').on('click', (event) => {
        showModal(event);
    })

    // Close modals when modal close button clicked
    $('span').on('click', hideModal);

    // Clicking outside of modal will close modal
    $(window).on('click', (event) => {
        if (event.target.id === 'modal1' || event.target.id === 'modal2') {
            // $('.modal').css('display', 'none');
            hideModal();
        }
    })
});