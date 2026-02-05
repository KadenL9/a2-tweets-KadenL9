function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		let t = new Tweet(tweet.text, tweet.created_at);
		return {
			time: t.time,
			distance: t.distance,
			activityType: t.activityType
		}
	});

	let activityCount = new Map();
	let activityTotal = new Map();

	tweet_array.forEach((tweet) => {
		let activity = tweet.activityType;
		let distance = tweet.distance;
		
		if (activity === "unknown") {
			return;
		}

		if (activityCount.has(activity)) {
			activityCount.set(activity, activityCount.get(activity) + 1);
			activityTotal.set(activity, activityTotal.get(activity) + distance); 
		}
		else {
			activityCount.set(activity, 1);
			activityTotal.set(activity, distance);
		}
	});

	document.getElementById("numberActivities").innerText = activityCount.size;

	// display 3 most common activities
	let activityArray = Array.from(activityCount.entries());
	activityArray.sort((a, b) => b[1] - a[1]);

	document.getElementById("firstMost").innerText = activityArray[0][0];
	document.getElementById("secondMost").innerText = activityArray[1][0];
	document.getElementById("thirdMost").innerText = activityArray[2][0];

	// display information about longest/shortest activity
	let averages = new Map();
	activityTotal.forEach((totalDistance, activityName) => {
		let count = activityCount.get(activityName);
		averages.set(activityName, totalDistance / count);
	});

	// display longest/shortest activities
	let activityAverage = Array.from(averages.entries());
	activityAverage.sort((a, b) => b[1] - a[1]);

	document.getElementById("longestActivityType").innerText = activityAverage[0][0];
	document.getElementById("shortestActivityType").innerText = activityAverage[activityAverage.length - 1][0];

	// display day of longest activities
	let activityDayCount = new Map();
	let activityDayTotal = new Map();

	activityDayCount.set("weekdays", 0);
    activityDayCount.set("weekends", 0);
    activityDayTotal.set("weekdays", 0);
    activityDayTotal.set("weekends", 0);

	tweet_array.forEach((tweet) => {
		if (tweet.activityType === "unknown") {
			return;
		}

		let day = tweet.time.getDay();
		let category = (day === 0 || day === 6) ? "weekends" : "weekdays";
		let activityDist = tweet.distance;

		activityDayCount.set(category, activityDayCount.get(category) + 1);
		activityDayTotal.set(category, activityDayTotal.get(category) + activityDist);

	});

	let dayAverages = new Map();
	activityDayTotal.forEach((totalDistance, category) => {
		let count = activityDayCount.get(category);
		dayAverages.set(category, totalDistance / count);
	});

	let dayAverage = Array.from(dayAverages.entries());
	dayAverage.sort((a, b) => b[1] - a[1]);

	document.getElementById("weekdayOrWeekendLonger").innerText = dayAverage[0][0];

	
	// plot of activities and their counts
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  },
	  "mark": "bar",
	  "encoding": {
		"x": {
			"field": "activityType",
			"type": "nominal",
			"axis": {"title": "Activity Type"}
		},
		"y": {
			"aggregate": "count",
			"type": "quantitative",
			"axis": {"title": "Count"}
		}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	let isAggregated = false;
	renderGraph(tweet_array, activityArray, isAggregated);

	document.getElementById("aggregate").addEventListener("click", function() {
		isAggregated = !isAggregated;
		
		this.innerText = isAggregated ? "Show all activities" : "Show means";

		renderGraph(tweet_array, activityArray, isAggregated);
	});
}

function renderGraph(tweet_array, activityArray, isAggregated) {
	distance_vis_agg_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Average distances by day of the week for top 3 activities",
		"data": { "values": tweet_array },
		"transform": [
			{
				"filter": {
					"field": "activityType",
					"oneOf": [activityArray[0][0], activityArray[1][0], activityArray[2][0]]
				}
			}
		],
		"mark": "point",
		"encoding": {
			"x": {
				"field": "time",
				"type": "temporal",
				"timeUnit": "day",
				"sort": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				"axis": {"title": "Day of Week"}
			},
			"y": {
				"field": "distance",
				"aggregate": isAggregated ? "average" : undefined,
				"type": "quantitative",
				"axis": isAggregated ? {"title": "Average Distance (mi)"} : {"title": "Distance (mi)"}
			},
			"color": {
				"field": "activityType",
				"type": "nominal",
				"legend": {"title": "Activity Type"}
			}
		}
	};
	vegaEmbed("#distanceVisAggregated", distance_vis_agg_spec, {actions:false});
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});