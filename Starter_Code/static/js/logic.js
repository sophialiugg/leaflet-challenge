//url
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// create layer
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// create map
let myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 2,
    layers: [streets]
});

//define basemaps
let baseMaps = {
    "streets": streets
};


//store api endpoint
let earthquakes = new L.LayerGroup();

//geoJSON
d3.json(url).then(function (data) { 
    L.geoJson(data, {
        style: style,
        pointToLayer: function (feature, latlng) { return L.circleMarker(latlng).bindPopup(`<h3>Magnitude: ${feature.properties.mag}</p><hr><p>Location: ${feature.properties.place}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
        }
    }).addTo(earthquakes); 
    earthquakes.addTo(myMap);

});

//define the overlay object
let overlays = {
    "Earthquakes": earthquakes
};

//layer control
L.control.layers(baseMaps, overlays).addTo(myMap);

//stying for each feature
function style(feature) {
    return {
        radius: chooseMag(feature.properties.mag),
        color: chooseColor(feature.geometry.coordinates[2]),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        opacity: 0.5
    }
};

// fillColor based on earthquake depth
function chooseColor(depth) {
    if (depth <=25) {
        return "yellow";
    }
    else if (depth > 25 && depth <= 45) {
        return "green";
    }
    else if (depth > 45 && depth <= 65) {
        return "orange";
    }
    else if (depth > 65 && depth <= 85) {
        return "blue";
    }
    else
        return "red";
    };

//define a function to choose size for magnitude
function chooseMag(magnitude) {
    return magnitude*5;
};


//create legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Depth Color Legend</h4>";
       div.innerHTML += '<i style="background: yellow"></i><span>(Depth <= 25)</span><br>';
       div.innerHTML += '<i style="background: green"></i><span>(25 < Depth <= 45)</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>(45 < Depth <= 65)</span><br>';
       div.innerHTML += '<i style="background: blue"></i><span>(65 < Depth <= 85)</span><br>';
       div.innerHTML += '<i style="background: red"></i><span>(Depth > 85)</span><br>';
       
    return div;
  };
  //add legend to map
  legend.addTo(myMap);
