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
		url: false
	},
  	
  	start: function() {	
		Log.info("Starting module: " + this.name);
	
		
		if (this.config.url === false) { 
			Log.info("No URL set under config, using dafault profile image: " + this.data.path + "pictures/user-profile.png");
			this.config.url = "./" + this.data.path + "pictures/user-profile.png";
		}	
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
    
		wrapper.appendChild(element);
		wrapper.appendChild(image);
		return wrapper;
    
	},

});
