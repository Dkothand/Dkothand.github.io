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


// Doesn't work
/*** Render unique content to DOM, trying to avoid repeats */
// const renderObject = (object) => {
//     const contentName = object.name;
//     const contentImg = object.picture;
//     const contentLocations = object.locations;

//     // Build image tag of content image
//     const $img = $('<img>')
//     .attr('src', contentImg)
//     .attr('alt', contentName);

//     const $cardDiv = $('<div>').attr('class', 'card');
//     $cardDiv.append(`<h5>${contentName}</h5>`);

//     const $imgDiv = $('<div>').attr('class', 'content-img');
//     $imgDiv.append($img);
//     $cardDiv.append($imgDiv);

//     $cardDiv.append(`<h5>Streaming on:</h5>`);

//     const $ulStreamLinks = $('<ul>');

//     for (let stream of contentLocations) {
//         const streamName = stream.display_name;
//         const streamURL = stream.url;


//         const $aStreamLink = $('<a>').attr('href', streamURL)
//             .text(streamName);
//         const $listItem = $('<li>').append($aStreamLink);            
//         $ulStreamLinks.append($listItem);
//     }

//     $cardDiv.append($ulStreamLinks);
//     $('.container').append($cardDiv);
// }

// build array of unique names <-- done
// function with array and results array
// for obj in results
    // if obj.name is in array
        // buildCard()
        // array.splice(indexOf(obj.name), 1)

// takes two arrays
// builds object out of array and results

// object with name and array of location objects
    // add to array
// if results.name is object.name in array
    // loop through results.location array and push each object into object.locations


// const makeUniqueContent = (array, results) => {
//     // results array of objects
//     console.log(results)
//     for (content of results) {
//         console.log(content.name) // logs undefined
//         let presentInBoth = array.indexOf(content.name)
//         if (presentInBoth >= 0) {
//             // build div.card of current object
//             renderObject(content);
//             array.splice(presentInBoth, 1);
//         }
//     }
// }

// Modal show and hide functions
// const showModal = (num) => {
//     $('.modal').eq(num).css('display', 'block');
// };

// const hideModal = (num) => {
//     $('.modal').eq(num).css('display', 'none');
// };

// const contentNameArray = [];
// // loop through results array
// // content is an object

// fills array with unique names
// for (let content of results) {
//     const contentName = content.name;
//     if (contentNameArray.indexOf(contentName) === -1) {
//         contentNameArray.push(contentName);
//     }
// }

// console.log(contentNameArray);

// makeUniqueContent(contentNameArray, results);



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


// Renders media data to the DOM
const parseData = (results) => {
    // Clear previous search results
    resetFields();
    // console.log(results);

    
    // Check if results array is empty, render msg to DOM
    renderSearchHeader(results)
    
    for (let content of results) {
        const contentName = content.name; // name
        const contentImg = content.picture; // image link
        const locations = content.locations; // streams array

        //id for localStorage key
        const id = content.id;
        
        // Build image tag of content image
        const $img = $makeImg(contentName, contentImg);


        const $cardDiv = $('<div>').attr('class', 'card');
        $cardDiv.append(`<h5>${contentName}</h5>`);

        const $imgDiv = $('<div>').attr('class', 'content-img');
        $imgDiv.append($img);
        $cardDiv.append($imgDiv);

        // remove this
        // $cardDiv.append(`<h5>Streaming on:</h5>`);

        // create div with class card-back
        // append ul to card-back div
        // append card-back div to $cardDiv
        const $hoverDiv = $('<div>').attr('class', 'card-back');

        const $ulStreamLinks = $('<ul>');

        for (let stream of locations) {
            const streamName = stream.display_name;
            const streamURL = stream.url;


            const $aStreamLink = $('<a>').attr('href', streamURL)
                .attr('target', '_blank')
                .text(streamName);
            const $listItem = $('<li>').append($aStreamLink);            
            $ulStreamLinks.append($listItem);
        }

        $hoverDiv.append($ulStreamLinks);
        $cardDiv.append($hoverDiv);


        // function that takes jQuery object and saves it to localStorage here
        console.log('cardDiv object', $cardDiv);
        saveToLocalStorage(id, $cardDiv);


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


    // listener for hover on generated cards
    // not working because .cards are dynamically generated, need to bind to static parent and specify dynamic child

    // binding to body, specify .card as dynamic child

    // Works, but changing to click for better UX, scrolling titles and mouseover isn't as good of an experience
    // $('body').on('mouseenter', '.card', (event) => {
    //     // toggles .card-back div
    //     // console.log($(event.currentTarget))
    //     $(event.currentTarget).children().eq(2).toggle();
    // }).on('mouseleave', '.card', (event) => {
    //     $(event.currentTarget).children().eq(2).toggle();
    // });

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
        // rewrite possibly to 
        // ('scrolled', (event) => {
        // $(event.currentTarget).scrollTop()
        //})
        // should hopefully work

        // doesn't work
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