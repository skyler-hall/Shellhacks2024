let directionsService;
let directionsRenderer;

function initMap() {
    // Initialize map options
    const mapOptions = {
        zoom: 7,
        center: { lat: 25.7617, lng: -80.1918 } // Miami, FL
    };

    // Create map instance
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Initialize DirectionsService and DirectionsRenderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

function setNotification() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const threshold = parseInt(document.getElementById("threshold").value, 10);
    const phoneNumber = document.getElementById("phoneNumber").value;

    // Validate input
    if (!start || !end || isNaN(threshold) || !phoneNumber) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Store user input in the backend (replace with your backend API call)
    fetch('https://your-backend-server.com/api/setNotification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            start: start,
            end: end,
            threshold: threshold,
            phoneNumber: phoneNumber
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Notification set successfully!");
        } else {
            alert("Failed to set notification. Please try again.");
        }
    })
    .catch(error => console.error("Error:", error));
}
