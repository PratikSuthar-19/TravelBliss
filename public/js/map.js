
  let map_token=maptoken;
  console.log(map_token);
	mapboxgl.accessToken = map_token;
  // mapboxgl.accessToken ='pk.eyJ1IjoicHJhdGlrMTkiLCJhIjoiY2xvMzI0YzJ3MDBhMDJrcHVyZTh1czRkZCJ9.0O_VAl7bYRBT6sJhMqyZpQ';
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

 
// console.log(coordinates);
// Create a new marker.
const marker = new mapboxgl.Marker({color : "red"})
    .setLngLat(listing.geometry.coordinates)//Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h5>${listing.title}</h5><p>Exact location will be provided after booking</p>`))
    .addTo(map);