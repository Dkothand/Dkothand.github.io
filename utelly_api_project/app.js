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
// dynamically render search results to DOM structured for styling as cards
/*************************************************************/

// parseData
    // get results
    // for each element of results array
    // append element.name
    // append element.picture
        // for each location of results array
            // append location.display_name
            // append location.url

// 'the office' returns 5 results in country=uk <-- success

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

    // parseData
    // get results
    // for each element of results array
    // append element.name
    // append element.picture
        // for each location of results array
            // append location.display_name
            // append location.url

    // loop through results array
    // content is an object
    for (let content of results) {
        const contentName = content.name;
        const contentImg = content.picture; // link to image

        // array of stream objects
        const locations = content.locations;

        $('.container').append(contentName);


        const $img = $('<img>')
        .attr('src', contentImg)
        .attr('alt', contentName);

        $('.container').append($img);

        // for each object in array
        for (let stream of locations) {
            const streamName = stream.display_name;
            const streamURL = stream.url;
            
            console.log(streamName);
            console.log(streamURL);
    
            // Append each to div
            $('.container').append(streamName);
            $('.container').append(streamURL);
        }
    }
    
    // console.log(contentName);
    // console.log(contentImg);
    
    // Clear previous search results
    // clearIds();
    
    // $('#content-name').append(contentName);
    // // $('#content-img').append(contentImg);
    
    // const $img = $('<img>')
    // .attr('src', contentImg)
    // .attr('alt', contentName);
    
    // $('#content-img').append($img);
    
    // locations array
    


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
    $('input[type=submit]').on('click', getApiData);
})