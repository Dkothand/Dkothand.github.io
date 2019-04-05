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
// populate DOM with every stream option for ONE search result
/*************************************************************/

// return content and image
// get every display_name and url from each object in locations array
// loop through locations array
// get element.display_name and element.url
// append to container

// The Office has 2 locations with us country <-- success
// The Office has 8 locations with uk country <-- success

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
    $('#content-name').empty();
    $('#content-img').empty();
    $('#stream-name').empty();
    $('#stream-url').empty();
}




// Gets text entered into search bar
const getInput = () => {
    const $input = $('input[type=text]').val();
    return $input;
}




// Testing parsing correct data
const parseData = (results) => {
    console.log(results[0]);
    const contentName = results[0].name;
    const contentImg = results[0].picture;
    
    console.log(contentName);
    console.log(contentImg);
    
    // Clear previous search results
    clearIds();
    
    $('#content-name').append(contentName);
    // $('#content-img').append(contentImg);
    
    const $img = $('<img>')
    .attr('src', contentImg)
    .attr('alt', contentName);
    
    $('#content-img').append($img);
    
    // locations array
    const locations = results[0].locations;
    // for each object in array
    for (let stream of locations) {
        const streamName = stream.display_name;
        const streamURL = stream.url;
        
        console.log(streamName);
        console.log(streamURL);

        // Append each to divs
        $('#stream-name').append(streamName);
        $('#stream-url').append(streamURL);
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
            country: "us"
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
    $('input[type=submit]').on('click', getApiData);
})