/* global Module */

/* Magic Mirror
 * Module: MMM-Profile
 *
 * By Kurt Frydenberg - http://www.kurtf.no
 * MIT Licensed.
 */

Module.register("MMM-Profile", {

	requiresVersion: "2.1.0",

	defaults: {
		// Add your name.
		yourName: "Kurt",
		// Add some random text	
		randomText: "you look amazing today!",
		// Transparency of the picture.
		opacity: 1.0,
		// Maximum width of the picture.
		maxWidth: "5%",
		// Maximum height of the picture.
		maxHeight: "5%",
		// Border-Radius of the picture.
		borderRadius: "50%",
		// The URL to the picture.
		url: false,
		// Compliments
		compliments: {
			day_sunny: [
                                "I dag blir det sol, kom deg ut!"
                        ],
                        snow: [
                                "I dag blir det snø, kle på deg godt."
                        ],
                        cloudy: [
                                "I dag blir det overskyet, greit og holde seg inne."
                        ],
                        day_cloudy: [
                                "I dag blir det overskyet, greit og holde seg inne."
                        ],
                        cloudy_windy: [
                                "Idag blir det mye vind, kle på deg godt, kan bli kaldt."
                        ],
                        showers: [
                                "I dag blir det regn, husk paraply."
                        ],
                        rain: [
                                "I dag blir det regn, husk paraply."
                        ],
                        thunderstorm: [
                                "I dag blir det tordenvær, på tide og ta frem kamera?"
                        ],
                        night_cloudy: [
                                "I dag blir det kaldt og overskyet."
                        ],
                        night_clear: [
                                "Det er lettskyet i dag."
                        ],
                        night_showers: [
                                "Skal du ut, ta med paraply"
                        ],
                        night_rain: [
                                "Skal du ut, ta med paraply"
                        ],
                        night_thunderstorm: [
                                "På tide og ta frem kamera?"
                        ],
                        night_snow: [
                                "Kaldt og snø."
                        ],
                        night_alt_cloudy_windy: [
                                "Varierende vær."
                        ],
                        fog: [
                                "Dårlig sikt! Kjør forsiktig."
                        ]
		},
		updateInterval: 30000,
		remoteFile: null,
		fadeSpeed: 4000,
		morningStartTime: 3,
		morningEndTime: 12,
		afternoonStartTime: 12,
		afternoonEndTime: 17
	},

	// Set currentweather from module
	currentWeatherType: "",

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define required scripts.
	getStyles: function () {
		return ["MMM-Profile.css", "font-awesome5.css", "font-awesome5.v4shims.css"];
	},
  	
  	start: function() {	
		Log.info("Starting module: " + this.name);
		
		this.lastComplimentIndex = -1;

		var self = this;
		if (this.config.remoteFile != null) {
			this.complimentFile(function(response) {
				self.config.compliments = JSON.parse(response);
				self.updateDom();
			});
		}

		// Schedule update timer.
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);
		
		if (this.config.url === false) { 
			Log.info("No URL set under config, using dafault profile image: " + this.data.path + "pictures/user-profile.png");
			this.config.url = "./" + this.data.path + "pictures/user-profile.png";
		}	
	},

	/* randomIndex(compliments)
	 * Generate a random index for a list of compliments.
	 *
	 * argument compliments Array<String> - Array with compliments.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(compliments) {
		if (compliments.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * compliments.length);
		};

		var complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/* complimentArray()
	 * Retrieve an array of compliments for the time of the day.
	 *
	 * return compliments Array<String> - Array with compliments for the time of the day.
	 */
	complimentArray: function() {
		var hour = moment().hour();
		var compliments;

		if (hour >= this.config.morningStartTime && hour < this.config.morningEndTime && this.config.compliments.hasOwnProperty("morning")) {
			compliments = this.config.compliments.morning.slice(0);
		} else if (hour >= this.config.afternoonStartTime && hour < this.config.afternoonEndTime && this.config.compliments.hasOwnProperty("afternoon")) {
			compliments = this.config.compliments.afternoon.slice(0);
		} else if(this.config.compliments.hasOwnProperty("evening")) {
			compliments = this.config.compliments.evening.slice(0);
		}

		if (typeof compliments === "undefined") {
			compliments = new Array();
		}

		if (this.currentWeatherType in this.config.compliments) {
			compliments.push.apply(compliments, this.config.compliments[this.currentWeatherType]);
		}

		compliments.push.apply(compliments, this.config.compliments.anytime);

		return compliments;
	},

	/* complimentFile(callback)
	 * Retrieve a file from the local filesystem
	 */
	complimentFile: function(callback) {
		var xobj = new XMLHttpRequest(),
			isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			path = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		xobj.overrideMimeType("application/json");
		xobj.open("GET", path, true);
		xobj.onreadystatechange = function() {
			if (xobj.readyState == 4 && xobj.status == "200") {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	},

	/* complimentArray()
	 * Retrieve a random compliment.
	 *
	 * return compliment string - A compliment.
	 */
	randomCompliment: function() {
		var compliments = this.complimentArray();
		var index = this.randomIndex(compliments);

		return compliments[index];
	},

	getDom: function() {
  		var element = document.createElement("div");
		var wrapper = document.createElement("div");
		var image = document.createElement("img");
  		
    		element.className = "myProfile";
  		element.innerHTML = this.config.yourName + this.config.randomText;
  		element.className = this.config.classes ? this.config.classes : "small bright pre-line";

		image.src = this.config.url;
		image.id = "mmm-profile";
		image.style.maxWidth = this.config.maxWidth;
		image.style.maxHeight = this.config.maxHeight;
		image.style.opacity = this.config.opacity;
		image.style.borderRadius = this.config.borderRadius;

		var complimentText = this.randomCompliment();

		var compliment = document.createTextNode(complimentText);
		var wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "small bright pre-line";
    
		wrapper.appendChild(image);
		wrapper.appendChild(element);
		wrapper.appendChild(compliment);
		return wrapper;
	},
    
	// From data currentweather set weather type
	setCurrentWeatherType: function(data) {
		var weatherIconTable = {
			"01d": "day_sunny", 
			"02d": "day_cloudy",
			"03d": "cloudy",
			"04d": "cloudy_windy",
			"09d": "showers",
			"10d": "rain",
			"11d": "thunderstorm",
			"13d": "snow",
			"50d": "fog",
			"01n": "night_clear",
			"02n": "night_cloudy",
			"03n": "night_cloudy",
			"04n": "night_cloudy",
			"09n": "night_showers",
			"10n": "night_rain",
			"11n": "night_thunderstorm",
			"13n": "night_snow",
			"50n": "night_alt_cloudy_windy"
		};
		this.currentWeatherType = weatherIconTable[data.weather[0].icon];
	},


	// Override notification handler.
	notificationReceived: function(notification, payload, sender) {
		if (notification == "CURRENTWEATHER_DATA") {
			this.setCurrentWeatherType(payload.data);
		}
	},

});

