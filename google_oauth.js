	//https://developers.google.com/identity/protocols/OAuth2UserAgent
	
    //adding authentication functions to the object
		
	OAuthModule = {		
		auth: handleAuthClick		
	};    

	var GoogleAuth;  
	var SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

	
	function handleAuthClick(apiKey, clientId) {			

		$.getScript( "https://apis.google.com/js/api.js", function( data, textStatus, jqxhr ) {

			//set the authentication variables
			OAuthModule.apiKey = apiKey;
			OAuthModule.clientId = clientId;		
			
			console.log( "Load was performed." );

			handleClientLoad();
		});			       
    }


	function handleClientLoad() {
		// Load the API's client and auth2 modules.
		// Call the initClient function after the modules load.
		console.log("Script loaded");
		gapi.load('client:auth2', initClient);
	}	
	
	
	function initClient() {
		// Retrieve the discovery document for version 4 of Analytics Reporting API
		// In practice, your app can retrieve one or more discovery documents.		
	
		// Initialize the gapi.client object, which app uses to make API requests.
		// Get API key and client ID from API Console.
		// 'scope' field specifies space-delimited list of access scopes.
		
		var discoveryUrl = 'https://analyticsreporting.googleapis.com/$discovery/rest?version=v4';

		gapi.client.init({
			'apiKey': OAuthModule.apiKey,
			'discoveryDocs': [discoveryUrl],
			'clientId': OAuthModule.clientId,
			'scope': SCOPE
	}).then(function () {

			GoogleAuth = gapi.auth2.getAuthInstance();
			//console.log(GoogleAuth);
		
			// Listen for sign-in state changes.
			GoogleAuth.isSignedIn.listen(updateSigninStatus); 

			requestAuth();			
		});	
	}	
	
	
	function setSigninStatus(isSignedIn) {
	
		var user = GoogleAuth.currentUser.get();
		var isAuthorized = user.hasGrantedScopes(SCOPE);
		if (isAuthorized) {

			console.log("Authorization completed");			
			
			// Create an event to indicate that the authentication is completed
			var event = new CustomEvent("oauth_success", {});			
			// Fire the event
			document.dispatchEvent(event);

		} else {
			console.log("Authorization suspended");
		}
		
	}	
	
	
	function updateSigninStatus(isSignedIn) {
		setSigninStatus();
	}	
	
	
	function requestAuth() {
	
		if (GoogleAuth.isSignedIn.get()) {
			console.log("Signed in"); 
			
			// Create an event to indicate that the authentication is completed
			var event = new CustomEvent("oauth_success", {});			
			// Fire the event
			document.dispatchEvent(event);

		} else {
			console.log("Signed out");
			// User is not signed in. Start Google auth flow.
			GoogleAuth.signIn();
		}
	}