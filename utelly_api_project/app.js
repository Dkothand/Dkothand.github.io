// Solution for using ajax instead of unirest
// https://mashape.groovehq.com/knowledge_base/categories/consume-an-api/topics
// Key is to pass API key into setRequestHeader in beforeSend function
// I think it does the same thing as unirest.().header("API Key here")
$(() => {
    $.ajax({
        url: "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=bojack&country=uk",
        type: 'GET',
        dataType: "json",
        beforeSend: (xhr) => {
            xhr.setRequestHeader(
                "X-RapidAPI-Key", "52122fb71bmsh21d596050a233b7p18b88ajsnf76ae4c3d8e5"
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