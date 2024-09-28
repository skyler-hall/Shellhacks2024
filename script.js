function loadGoogleAPI() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
      apiKey: 'YOUR_API_KEY',
      clientId: 'YOUR_CLIENT_ID',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar' // Set the necessary scope for your app
  }).then(() => {
      // Check if the user is signed in or not
      if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          console.log("User is already signed in.");
      } else {
          console.log("User is not signed in.");
      }
  }, (error) => {
      console.error("Error initializing Google API client", error);
  });
}
