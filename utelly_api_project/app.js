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
// Current Task: 

//  - Add media query min-width: 700px
//      - at query, two columns of cards
//  - Add media query min-width: 1300px
//      - at query, three columns of cards


// media queries - space (margins) between cards is too wide when you hit multiple columns across

// adjust margins for media queries



//  - Implement name (StreamSift?)
//  - change directory name to app name
//  - Research fonts
// ----------------- done ------------------------
// CSS styling
//  - Create space between content cards
//      - decrease flex-basis and add top/bottom margins
//  - Size content text appropriately
//  - Test adding a Results header that appears after button click(query)
/*************************************************************/

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






const apiKey = "52122fb71bmsh21d596050a233b7p18b88ajsnf76ae4c3d8e5";

// Empties divs with rendered content
const clearIds = () => {
    $('.container').empty();
}




// Gets text entered into search bar
const getInput = () => {
    const $input = $('input[type=text]').val();
    return $input;
}




// Testing parsing correct data
const parseData = (results) => {
    // Clears previous search results
    clearIds();
    console.log(results);
    
    // // loop through results array
    // // content is an object
    for (let content of results) {
        const contentName = content.name; //content name
        const contentImg = content.picture; // link to image
        
    //     // array of stream objects
        const locations = content.locations;
        
        // Build image tag of content image
        const $img = $('<img>')
        .attr('src', contentImg)
        .attr('alt', contentName);

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
        url: "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup",
        type: 'GET',
        dataType: "json",
        data: {
            // search term, what user will input
            term: searchTerm,
            // country, either us or uk
            country: "uk"
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
        parseData(data.results);
    }, (error) => {
        console.error(error);
    })
}


$(() => {
    // testing card appearance, change callback to 'getApiData' for normal functionality
    $('input[type=submit]').on('click', () => {
            $('.card').toggle();
            $('.results').toggle();
        });
})

// () => {
//     $('.card').toggle();
//      $('.results').toggle();
// }