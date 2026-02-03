function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	updateDateRange(tweet_array);

	categorizeTweets(tweet_array);
}


function updateDateRange(tweet_array) {
	let earliestDate = tweet_array[0].time;
	let latestDate = tweet_array[0].time;

	tweet_array.forEach((tweet) => {
		let currDate = tweet.time;
		if (currDate < earliestDate) {
			earliestDate = currDate;
		}

		if (currDate > latestDate) {
			latestDate = currDate;
		}
	});

	const format = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}

	document.getElementById('firstDate').innerText = earliestDate.toLocaleDateString('en-US', format);
	document.getElementById('lastDate').innerText = latestDate.toLocaleDateString('en-US', format);
}


function categorizeTweets(tweet_array) {
	let completed = 0;
	let live = 0;
	let achievement = 0;
	let miscellaneous = 0;
	let user_written = 0;

	tweet_array.forEach((tweet) => {
		if (tweet.source === 'completed_event') {
			completed++;

			if (tweet.written) {
				user_written++;
			}
		}
		else if (tweet.source === 'live_event') {
			live++;
		}
		else if (tweet.source === 'achievement') {
			achievement++;
		}
		else {
			miscellaneous++;
		}
	});

	total = completed + live + achievement + miscellaneous;

	// update the totals
	document.getElementsByClassName('completedEvents')[0].innerText = completed;
	document.getElementsByClassName('liveEvents')[0].innerText = live;
	document.getElementsByClassName('achievements')[0].innerText = achievement;
	document.getElementsByClassName('miscellaneous')[0].innerText = miscellaneous;
	
	// percentages
	document.getElementsByClassName('completedEventsPct')[0].innerText = (completed / total * 100).toFixed(2) + "%";
	document.getElementsByClassName('liveEventsPct')[0].innerText = (live / total * 100).toFixed(2) + "%";
	document.getElementsByClassName('achievementsPct')[0].innerText = (achievement / total * 100).toFixed(2) + "%";
	document.getElementsByClassName('miscellaneousPct')[0].innerText = (miscellaneous / total * 100).toFixed(2) + "%";

	// user-written
	document.getElementsByClassName("completedEvents")[1].innerText = (completed / total * 100).toFixed(2) + "%";
	document.getElementsByClassName("written")[0].innerText = user_written;
	document.getElementsByClassName("writtenPct")[0].innerText = (user_written / completed * 100).toFixed(2) + "%";
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});