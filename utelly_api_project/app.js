//============================================================================
// Solution for using ajax instead of unirest
// https://mashape.groovehq.com/knowledge_base/categories/consume-an-api/topics
// Key is to pass API key into setRequestHeader in beforeSend function
// I think it does the same thing as unirest.get().header("API Key here")

// Link for more reading into getting unirest to work if I have time
// https://stackoverflow.com/questions/19059580/client-on-node-uncaught-referenceerror-require-is-not-defined
// https://www.youtube.com/watch?v=G3soxqHAEd8
//============================================================================
// test url :"https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=bojack&country=uk"

/*************************************************************/
// Current Tasks: 

// nav bar should have modal/scroll something dynamic that manipulates the DOM
// Style modal
// Add text to modal content

// Add buttons to choose 'us' or 'uk' country for search






// CSS
// create 'hovered class' for cards


// JS 
// create array to push results into
    // can check for duplicates this way

    // 'Entourage' should return one result <-- done

/*********** Spiderman Homecoming is a duplicate, but the streams are different, find a way to merge location arrays **************************************/

// do the same thing that I did for content.name for stream.display_name
// put stream objects into new array and build card with hybrid results array and stream objects array

// add stream icon for stream lists


// add listener to cards for on:hover, toggle hovered class
    // content generation should append streams to hovered class


//  - Implement name (StreamSift?)
//  - change directory name to app name
//  - Research fonts
    // Cabin and Lobster again?
    // text shadow

// Sky blue background, white h1 text with big text shadow
// search button probably a yellow or oranges
// ----------------- done ------------------------
//*************************************************************/

// parseData

// API data
// data.results is array []
// each element in array is an object
// object properties:

//id: identifier for that movie/tv show
//locations: array [] of objects {}
// each object is a streaming option
// object properties:

//display_name: Name of streaming service "Netflix"
//icon: Image of streaming service
//id: identifier of service
//name: more specific name "NetflixUS"
//url: url of movie/show on service site (location on Netflix site)

//name: name of movie/tv show "Bojack Horseman"
//picture: image of movie/tv show
//weight: no idea what this is for

// Content name: data.results[0].name
// Content picture: data.results[0].picture
// Content streaming (first location): data.results[0].locations[0].display_name
// Content url (first location): data.results[0].locations[0].url

/****NOTE*******/
// If there isn't a picture available for item or service, array/object holds NULL value





const apiURL = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup";
const apiKey = "52122fb71bmsh21d596050a233b7p18b88ajsnf76ae4c3d8e5";
const imageNotFound = "https://dubsism.files.wordpress.com/2017/12/image-not-found.png";

// Empties divs with rendered content and clears input text box
const clearIds = () => {
    $('.container').empty();
    $('input[type=text]').val('');
}




// Gets text entered into search bar
const getInput = () => {
    const $input = $('input[type=text]').val();
    return $input;
}

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
const showModal = () => {
    $('.modal').css('display', 'block');
};

const hideModal = () => {
    $('.modal').css('display', 'none');
};

// Testing parsing correct data
const parseData = (results) => {
    // Clears previous search results
    clearIds();
    console.log(results);
    
    // const contentNameArray = [];
    // // // loop through results array
    // // // content is an object

    // // fills array with unique names
    // for (let content of results) {
    //     const contentName = content.name;
    //     if (contentNameArray.indexOf(contentName) === -1) {
    //         contentNameArray.push(contentName);
    //     }
    // }

    // console.log(contentNameArray);

    // makeUniqueContent(contentNameArray, results);
    for (let content of results) {
        const contentName = content.name; //content name
        const contentImg = content.picture; // link to image
        
    //     // array of stream objects
        const locations = content.locations;
        
        // Build image tag of content image
        const $img = $('<img>');
        // .attr('src', contentImg)
        // .attr('alt', contentName);

        if (contentImg) {
            $img.attr('src', contentImg)
                .attr('alt', contentName);
        } else {
            $img.attr('src', imageNotFound)
                .attr('alt', 'Image not found')
        }

        const $cardDiv = $('<div>').attr('class', 'card');
        $cardDiv.append(`<h5>${contentName}</h5>`);

        const $imgDiv = $('<div>').attr('class', 'content-img');
        $imgDiv.append($img);
        $cardDiv.append($imgDiv);

        $cardDiv.append(`<h5>Streaming on:</h5>`);

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

        $cardDiv.append($ulStreamLinks);
        $('.container').append($cardDiv);
    }
}


// API call with entered text as search term
const getApiData = () => {

    const searchTerm = getInput();

    $.ajax({
        url: apiURL,
        type: 'GET',
        dataType: "json",
        data: {
            // search term, what user will input
            term: searchTerm
            // country, either us or uk
            // none returns both, maybe not
            // country: "us"
        },
        beforeSend: (xhr) => {
            xhr.setRequestHeader(
                "X-RapidAPI-Key", apiKey
            );
        }
    }).then((data) => {
        // returning data
        // data = JSON.stringify(data);
        // console.log(data.results);
        console.log(data);
        parseData(data.results);
    }, (error) => {
        console.error(error);
    })
}


$(() => {
    // testing card appearance, change callback to 'getApiData' for normal functionality
    $('input[type=submit]').on('click', getApiData);


    // Modal listeners and handlers
    $('#modal-about').on('click', showModal);
    $('.close').on('click', hideModal);
    $(window).on('click', () => {
        // console.log('window clicked');
        if (event.target == modal) {
            hideModal();
        }
    })
});

// () => {
//     $('.card').toggle();
//      $('.results').toggle();
// }