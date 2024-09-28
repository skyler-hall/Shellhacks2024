// Load the Google API client library
function loadGoogleAPI() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
      apiKey: 'YOUR_API_KEY',
      clientId: 'YOUR_CLIENT_ID',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar'
  }).then(() => {
      // Check if the user is already signed in
      if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          // User signed in
      } else {
          // Prompt user to sign in
          gapi.auth2.getAuthInstance().signIn();
      }
  });
}

function calculateRoute() {
  const startAddress = document.getElementById('startAddress').value;
  const endAddress = document.getElementById('endAddress').value;
  const threshold = parseInt(document.getElementById('threshold').value, 10);

  // Check if all fields are filled
  if (!startAddress || !endAddress || isNaN(threshold)) {
      document.getElementById('result').innerText = 'Please enter all fields.';
      return;
  }

  const directionsService = new google.maps.DirectionsService();
  const directionsRequest = {
      origin: startAddress,
      destination: endAddress,
      travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(directionsRequest, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
          const route = response.routes[0].legs[0];
          const travelTimeMinutes = route.duration.value / 60;

          if (travelTimeMinutes <= threshold) {
              alert('Current travel time is below your threshold!');
          } else {
              document.getElementById('result').innerText = `Current travel time: ${travelTimeMinutes} minutes.`;
              // Store user data
              localStorage.setItem('startAddress', startAddress);
              localStorage.setItem('endAddress', endAddress);
              localStorage.setItem('threshold', threshold);
              // Start checking travel time periodically
              setInterval(checkRouteDuration, 300000); // Check every 5 minutes
          }
      } else {
          document.getElementById('result').innerText = 'Could not calculate route. Please try again.';
      }
  });
}

function checkRouteDuration() {
  const startAddress = localStorage.getItem('startAddress');
  const endAddress = localStorage.getItem('endAddress');
  const threshold = parseInt(localStorage.getItem('threshold'), 10);

  if (!startAddress || !endAddress || isNaN(threshold)) {
      console.error('Missing data for route check.');
      return;
  }

  const directionsService = new google.maps.DirectionsService();
  const directionsRequest = {
      origin: startAddress,
      destination: endAddress,
      travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(directionsRequest, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
          const route = response.routes[0].legs[0];
          const travelTimeMinutes = route.duration.value / 60;

          if (travelTimeMinutes <= threshold) {
              alert(`Travel time is now below your threshold: ${travelTimeMinutes} minutes!`);
              // Optional: Add a calendar event or notification
          }
      } else {
          console.error('Could not calculate route for periodic check.');
      }
  });
}
