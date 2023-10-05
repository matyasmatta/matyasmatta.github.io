var map = L.map('map', {
	minZoom: 6, // Set your desired minimum zoom level here
}).setView([50.0, 14.0], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 8,
}).addTo(map);
var marker;
var poiList = [
	["Lipno", [48.634722, 14.225000]],
	["Hněvkovice", [48.738850, 14.097419]],
	["Kořensko", [50.405591, 13.881128]],
	["Orlík", [49.559722, 14.121667]],
	["Kamýk", [49.896667, 14.277778]],
	["Slapy", [49.731389, 14.252222]],
	["Štěchovice", [49.909167, 14.352500]],
	["Nechranice", [50.350000, 13.470000]],
	["Hracholusky", [49.723611, 13.388056]],
	["České údolí", [49.456667, 13.650000]],
	["Nýrsko", [49.443333, 13.331389]],
	["Švihov", [49.646944, 13.405556]],
	["Dlouhé stráně", [50.006389, 17.327500]],
	["Dalešice", [49.263889, 16.263056]],
	["Nové Mlýny", [48.931111, 16.606944]],
	["Vranov", [48.896389, 15.861111]],
	["Pastviny", [49.854444, 16.758056]],
	["Slezská Harta", [49.899722, 18.399722]],
	["Šance", [48.764167, 16.694167]],
	["Brněnská přehrada", [49.225278, 16.643056]],
	["Černé", [49.152222, 13.650556]],
	["Čertovo", [49.137778, 13.694167]],
	["Prášilské", [49.116389, 13.175278]],
	["Plešné", [49.047500, 13.322500]],
	["Laka", [48.874444, 13.653611]],
	["Tříjezerní slať", [48.833056, 13.533611]],
	["Chalupská slať", [49.045000, 13.454722]],
	["Hromnické", [49.342778, 13.043611]],
	["Odlezelské", [49.393333, 12.956667]]
];
var currentPoiIndex = 0;
var actualCoords;

function onMapClick(e) {
	if (marker) {
		map.removeLayer(marker);
	}
	marker = L.marker(e.latlng).addTo(map);
}
map.on('click', onMapClick);

function submitGuess() {
	if (marker) {
		var guessCoords = marker.getLatLng();
		var distance = calculateDistance(guessCoords, actualCoords);
		document.getElementById('result').innerHTML = 'Tvůj odhad byl přibližně ' + distance.toFixed(1) + ' kilometrů od cíle.';
		// Add marker at guessed location
		L.marker(guessCoords).addTo(map);
		// Add marker at actual location (POI)
		L.marker(actualCoords, {
			icon: L.divIcon({
				className: 'poi-marker'
			})
		}).addTo(map);
		// Move to the next POI
		currentPoiIndex++;
		if (currentPoiIndex < poiList.length) {
			setNewPoi();
		} else {
			document.getElementById('result').innerHTML += "<br>End of the game.";
		}
	} else {
		document.getElementById('result').innerHTML = 'Please set a pin on the map first.';
	}
}

function calculateDistance(guessCoords, actualCoords) {
	return L.latLng(guessCoords).distanceTo(actualCoords) / 1000;
}

function setNewPoi() {
	// Clear the previous marker
	if (marker) {
		map.removeLayer(marker);
	}
	// Set the new POI
	var currentPoi = poiList[currentPoiIndex];
	actualCoords = currentPoi[1];
	document.getElementById('poi-name').innerHTML = currentPoi[0];
}
// Initialize with the first POI
setNewPoi();