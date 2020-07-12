//Our endpoint for query
query_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [streetmap]
});

function getColor(magnitude){
  var color;

  if(magnitude < 1)
    color = "#28AD21"
  else if(magnitude >=1 && magnitude < 2)
    color = "#C0EB54";
  else if(magnitude >=2 && magnitude < 3)
    color = "#FFBE00";
  else if(magnitude >=3 && magnitude < 4)
    color = "#FF8800";
  else if(magnitude >=4 && magnitude < 5)
    color = "#FF5800";
  else if(magnitude >= 5)
    color = "#FF0000";

  return color;
}

function createFeatures(earthquakesData){

  function pointToLayer(geoJsonPoint, latlng){

    var geojsonMarkerOptions = {
      fillOpacity: 0.50,
      color: getColor(geoJsonPoint.properties.mag),
      fillColor: getColor(geoJsonPoint.properties.mag),
      // Adjust radius
      radius: (geoJsonPoint.properties.mag * 5)
    }
    return new L.circleMarker(latlng, geojsonMarkerOptions).bindPopup("<h3>" + geoJsonPoint.properties.place +
    "</h3><hr><p>" + new Date(geoJsonPoint.properties.time) + "</p>");;
  }

  L.geoJSON(earthquakesData, {
    pointToLayer:pointToLayer
  }).addTo(myMap);

  // Create a legend to display information about our map
  var info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");

    colorLegend = "<div>" + 
    "<ul class=\"legend_list\">" +
      "<li style=\"background-color: #28AD21\">0-1</li>" +
      "<li style=\"background-color: #C0EB54\">1-2</li>" +
      "<li style=\"background-color: #FFBE00\">2-3</li>" +
      "<li style=\"background-color: #FF8800\">3-4</li>" +
      "<li style=\"background-color: #FF5800\">4-5</li>" +
      "<li style=\"background-color: #FF0000\">5+</li>" +
    "</ul>" +
    "</div>"

    div.innerHTML = colorLegend;
    return div;
  };

  // Add the info legend to the map
  info.addTo(myMap);
}

d3.json(query_url, function(data){
  createFeatures(data.features)
});