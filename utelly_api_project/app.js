//============================================================================
// Solution for using ajax instead of unirest
// https://mashape.groovehq.com/knowledge_base/categories/consume-an-api/topics
// Key is to pass API key into setRequestHeader in beforeSend function
// I think it does the same thing as unirest.get().header("API Key here")

// Link for more reading into getting unirest to work if I have time
// https://stackoverflow.com/questions/19059580/client-on-node-uncaught-referenceerror-require-is-not-defined
//============================================================================
// test url :"https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=bojack&country=uk"
const apiKey = "52122fb71bmsh21d596050a233b7p18b88ajsnf76ae4c3d8e5";

$(() => {
    $.ajax({
        url: "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup",
        type: 'GET',
        dataType: "json",
        data: {
            // search term
            term: "bojack",
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
        console.log(data.results);
    }, (error) => {
        console.error(error);
    })
})