// Client ID and API key from the Developer Console
var CLIENT_ID = '732086894303-lerfn1rgm6u6jdjci1ct4uvvv9mft077.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDVKg8BVU8_41BaVAwkWjuU0ckoh0MJvxs';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        //getData();
        //listMajors();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

 getData = async() => {
    // var data = {}
    await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1LKwvzwSWb3RjrjK6vG15Iyalv4ORzXdHrGSNm1Cipr4',
        range: 'Metrics!A2:J',
    }).then((responce) => {responce.result.values.forEach(cycle => {
          cycle1.cycles.push(new Cycle(cycle))
    });         
    }, (responce) => { // ERROR
        console.log("Error: " + responce.result.error.message)
    });

    cycle1.log()
}



class Cycle {
    constructor(cycle) {
        this.name = cycle[0]
        this.dateTime = new Date(cycle[1] + "T" + cycle[2] + ":00") 
        this.read = cycle[3] 
        this.norm =     cycle[4]
        this.correct =  cycle[5]
        this.suspense = cycle[6]
        this.easy =     cycle[7]
        this.med =      cycle[8]
        this.com =      cycle[9]
    }
}

class Sheet {
    constructor(){
        this.cycles = []
    }



    log(){
        console.log(this.cycles);
    }

}

var cycle1 = new Sheet()

console.log(cycle1.cycles)