
var map = L.map('map').setView([0, 0], 2); 

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to determine the color based on depth
function getColor(depth) {
    if (depth < 10) return "#00FF00"; 
    else if (depth < 50) return "#FFFF00"; 
    else return "#FF0000"; 
}


function getRadius(magnitude) {
    return Math.max(5, Math.min(20, magnitude * 5)); 
}

// Load and plot earthquake data from your GeoJSON URL
var geoJsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; 
fetch(geoJsonUrl)
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindPopup(`
                    <strong>Location:</strong> ${feature.properties.place}<br>
                    <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                    <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km
                `);
            }
        }).addTo(map);

       


    // Create a legend in the bottom right corner
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend"),
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];
    
        
        div.innerHTML += "<h4>Earthquake Depth</h4>";
    
        
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '; width: 20px; height: 20px; float: left; margin-right: 8px; opacity: 0.7;"></i>' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+') + '<br>';
        }
    
        return div;
    };
    
    
    legend.addTo(map);

})
.catch(error => console.error(error));