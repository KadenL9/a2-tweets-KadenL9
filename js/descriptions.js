function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	}).filter(t => t.written);

	return tweet_array;
}

function addEventHandlerForSearch() {
	let searchBox = document.getElementById("textFilter");

	searchBox.addEventListener("keyup", () => {
		let searchWord = searchBox.value.toLowerCase();

		let filteredTweets = tweet_array.filter(
			tweet => tweet.writtenText.toLowerCase().includes(searchWord)
		);


		document.getElementById("searchCount").innerText = filteredTweets.length;
		document.getElementById("searchText").innerText = searchWord;

		let table = document.getElementById("tweetTable");
		table.innerHTML = "";
		innerHTML = "";
		filteredTweets.forEach((tweet, index) => {
			console.log(tweet.getHTMLTableRow(index + 1));
			innerHTML += tweet.getHTMLTableRow(index + 1);
		})
		table.innerHTML = innerHTML;

	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});