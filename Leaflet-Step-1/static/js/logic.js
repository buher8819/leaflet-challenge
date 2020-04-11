var quakeJSON_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(quakeJSON_url, function(data) {
    createFeatures(data.features);
});

function createMap(equakes) {

    var map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var overlays = {
        "Earthquakes": equakes
    };

    var myMap = L.map("map", {
        center: [40.7, -95.95],
        zoom: 4,
        layers: [map, equakes]
    });

    var baseLayers = {
        "Map": map,
    };

    L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(myMap);
    //https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
    //https://www.igismap.com/legend-in-leafletjs-map-with-topojson/
    function getColor(d) {
        return d > 5 ? "red" :
            d > 4 ? "orange" :
            d > 3 ? "yellow" :
            d > 2 ? "green" :
            d > 1 ? "blue" :
                    "purple";
    }

    var legend = L.control({ position: 'bottomright' })

    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var magnitude = [0, 1, 2, 3, 4, 5];

        for (let i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(magnitude[i] + 1) + '"></i>' + magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }
        return div
    };
    legend.addTo(myMap);
  
  
};
function createFeatures(quakes) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h4 style = 'text-align:center;'>" + new Date(feature.properties.time) + //https://stackoverflow.com/questions/1646698/what-is-the-new-keyword-in-javascript
        "</h4> <hr> <h5 style = 'text-align:center;'>" + feature.properties.title + "</h5>")
    };
    var layerToMap = L.geoJSON(quakes, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var radius = feature.properties.mag *5;
            if (feature.properties.mag > 5) {
                fillColor = "red";
            }
            else if (feature.properties.mag > 4) {
                fillColor = "orange";
            }
            else if (feature.properties.mag > 3) {
                fillColor = "yellow";
            }
            else if (feature.properties.mag > 2) {
                fillColor = "green";
            }
            else if (feature.properties.mag > 1) {
                fillColor = "blue";
            }
            else
                fillColor = "purple";
            return L.circleMarker(latlng, {
                fillColor: fillColor,
                fillOpacity: 0.75,
                weight: 0.5,
                radius: radius,
                color: "black"
            });
        }
    });
    createMap(layerToMap);
}


