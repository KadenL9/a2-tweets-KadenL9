class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.includes("Just completed") || this.text.includes("Just posted")) {
            return "completed_event";
        }
        else if (this.text.includes("#RKLive") || this.text.includes("@Runkeeper Live")) {
            return "live_event";
        }
        else if (this.text.includes("Achieved")) {
            return "achievement";
        }
        else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written() {
        return this.text.includes("-");
    }
    
    get writtenText() {
        if (!this.written) {
            return "";
        }
        
        let written_text = this.text.split("-").slice(1).join("-");
        written_text = written_text.split("https")[0];
        
        return written_text.trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        
        let parsed_string = this.text;

        if (parsed_string.includes(" - ")) {
            parsed_string = parsed_string.split(" - ")[0].trim();
        }
        else {
            parsed_string = parsed_string.split("with @Runkeeper")[0].trim();
        }

        if (parsed_string.includes(" km ")) {
            parsed_string = parsed_string.split(" km ")[1].trim();
        }
        else if (parsed_string.includes(" mi ")) {
            parsed_string = parsed_string.split(" mi ")[1].trim();
        }
        else {
            parsed_string = parsed_string.split(" ").at(-1)?.trim() || "unknown";
        }

        return parsed_string;
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        
        let parsed_string = this.text;
        let isMiles = true;

        if (parsed_string.includes(" km ")) {
            isMiles = false;
            parsed_string = parsed_string.split(" km ")[0].trim();
        }
        else if (parsed_string.includes(" mi ")) {
            parsed_string = parsed_string.split(" mi ")[0].trim();
        }
        else {
            return 0;
        }
        
        parsed_string = parsed_string.split(" ").at(-1) || "0";
        parsed_string.trim();

        let dist: number = Number(parsed_string);
        if (! isMiles) {
            dist = dist / 1.609;
        }

        return dist;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}