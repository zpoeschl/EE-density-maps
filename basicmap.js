console.log('basicmap.js loaded');

// BASED ON: https://leafletjs.com/examples/choropleth/

var usMap = L.map('usMap').setView([37.8, -96], 4);
var worldMap = L.map('worldMap').setView([20, 0], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/light-v9',
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: api_key
}).addTo(usMap);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/light-v9',
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: api_key
}).addTo(worldMap);

L.geoJson(statesData).addTo(usMap);
L.geoJson(countriesData).addTo(worldMap);


// US MAP
function getColor(d) {
    return d > 100 ? '#4a1486' :
           d > 40  ? '#6a51a3' :
           d > 30  ? '#807dba' :
           d > 20  ? '#9e9ac8' :
           d > 10   ? '#bcbddc' :
           d > 5   ? '#dadaeb' :
           d >= 1   ? '#efedf5' :
                      '#fcfbfd';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var geojson;

geojson = L.geoJson(statesData, {style: style}).addTo(usMap);

function highlightFeature(e) {
    var layer = e.target
    info.update(layer.feature.properties);

    layer.setStyle({
        weight: 4,
        color: '#3f007d',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target)
    info.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(usMap);

var info = L.control();

info.onAdd = function (usMap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Employee Density 6/1/21</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' employees'
        : 'Hover over a state');
};

info.addTo(usMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (usMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 5, 10, 20, 30, 40, 100],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(usMap);


// WORLD MAP
// function getColorWorld(d) {
//     return d > 99 ? '#4a1486' :
//            d > 49  ? '#6a51a3' :
//            d > 29  ? '#9e9ac8' :
//            d > 9   ? '#dadaeb' :
//                       '#fcfbfd';
// }

// function style(feature) {
//     return {
//         fillColor: getColorWorld(feature.properties.DENSITY),
//         weight: 2,
//         opacity: 1,
//         color: 'white',
//         dashArray: '3',
//         fillOpacity: 0.7
//     };
// }

// var geojsonWorld;

// geojsonWorld = L.geoJson(countriesData, {style: style}).addTo(worldMap);

// function highlightFeature(e) {
//     var layer = e.target
//     info.update(layer.feature.properties);

//     layer.setStyle({
//         weight: 4,
//         color: '#3f007d',
//         dashArray: '',
//         fillOpacity: 0.7
//     });

//     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
//         layer.bringToFront();
//     }
// }

// function resetHighlight(e) {
//     geojsonWorld.resetStyle(e.target)
//     info.update();
// }

// function onEachFeature(feature, layer) {
//     layer.on({
//         mouseover: highlightFeature,
//         mouseout: resetHighlight
//     });
// }

// geojson = L.geoJson(countriesData, {
//     style: style,
//     onEachFeature: onEachFeature
// }).addTo(worldMap);

// var info = L.control();

// info.onAdd = function (worldMap) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };

// // method that we will use to update the control based on feature properties passed
// info.update = function (props) {
//     this._div.innerHTML = '<h4>Employee Density by Country 6/1/21</h4>' +  (props ?
//         '<b>' + props.ADMIN + '</b><br />' + props.DENSITY + ' employees'
//         : 'Hover over a country');
// };

// info.addTo(worldMap);

// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (worldMap) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 9, 29, 49, 99],
//         labels = [];

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + getColorWorld(grades[i] + 1) + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//     }

//     return div;
// };

// legend.addTo(worldMap);