// Firebase Configuration
const firebaseConfig = {
     apiKey: "AIzaSyD1TQEAApE3n8kuJ6rzm8Zn-uTn72Z518A",
     authDomain: "realtimelocationsharing-87a7f.firebaseapp.com",
     databaseURL: "https://realtimelocationsharing-87a7f-default-rtdb.asia-southeast1.firebasedatabase.app",
     projectId: "realtimelocationsharing-87a7f",
     storageBucket: "realtimelocationsharing-87a7f.firebasestorage.app",
     messagingSenderId: "455170341883",
     appId: "1:455170341883:web:162da438c5de24192a695e"
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    
    // Leaflet Map Initialization
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    const markers = {};
    // Function to get user's location
    function getLocation(userId) {
    if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
    (position) => {
    const { latitude, longitude } = position.coords;
    database.ref('locations/' + userId).set({
    latitude,
    longitude,
    });
    },
    (error) => {
    console.error('Error getting location:', error);
    }
    );
    } else {
    console.error('Geolocation is not supported by this browser.');
    }
    }
    // Function to update map markers
    function updateMarkers(userId, location) {
    if (!markers[userId]) {
    markers[userId] = L.marker([location.latitude, location.longitude]).addTo(map);
    } else {
    markers[userId].setLatLng([location.latitude, location.longitude]);
    }
    }
    // Function to calculate distance
    function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(2);
    }
    function deg2rad(deg) {
    return deg * (Math.PI / 180);
    }
    // Listen for location updates from Firebase
    database.ref('locations').on('value', (snapshot) => {
    const locations = snapshot.val();
    if (locations) {
    Object.keys(locations).forEach((userId) => {
    const location = locations[userId];
    updateMarkers(userId, location);
    // Calculate and display distance
    Object.keys(locations).forEach((otherUserId) => {
    if (userId !== otherUserId) {
    const otherLocation = locations[otherUserId];
    const distance = calculateDistance(
    location.latitude,
    location.longitude,
    otherLocation.latitude,
    otherLocation.longitude
    );
    console.log(
    `Distance between ${userId} and ${otherUserId}: ${distance} km`
    );
    }
    });
    });
    }
    });
    // Get user's location
    const userId = 'user1'; // Replace with a unique user ID
    getLocation(userId);