mapboxgl.accessToken ='pk.eyJ1IjoieWFzaDI0MyIsImEiOiJjbDdzdWt1N2Qwc3NjM29wdmxiOTRjYnppIn0.Vs97w7tdDK17SpBrTVo8fg'

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(`<h6>${campground.location}</h6>`)
    )
    .addTo(map);