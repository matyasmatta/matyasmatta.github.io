const startTime = Date.now(); 
const urlParams = new URLSearchParams(window.location.search);

// Get the query string parameters.
const queryStringParams = new URLSearchParams(window.location.search);
const jsonFile = urlParams.get('json') || 'povrch.json';
var limitPoiIndex = urlParams.get('max') || null;
var userName = urlParams.get('user') || "hráč";
var examinationModeControl = testURLBoolean(urlParams.get('exam'))
const gameName = jsonFile.substring(0, jsonFile.length - 5);

function testURLBoolean (variable) {
    console.log("testing...")
    if (variable === "true") {
        return true
    } else {
        return false
    }
}

if (limitPoiIndex === "NaN") {
    var limitPoiIndex = 10
}

function accuracyWarning () {
    if (jsonFile === "vodstvo.json" && examinationModeControl === true) {
        var warningElement = document.createElement('div');
        var warningText = 'Veškeré objekty jsou brané jako body,_ tudíž mohou být například řeky dost mimo,_ omlouvám se, výsledky berte s rezervou.';
        
        // Split the text at commas and join with <br> tags
        var warningTextWithBreaks = warningText.split('_').join('<br>');
    
        warningElement.innerHTML = warningTextWithBreaks;
        warningElement.style.backgroundColor = 'red';
        warningElement.style.color = 'white';
        warningElement.style.padding = '10px';
        warningElement.style.textAlign = 'center';
        document.body.insertBefore(warningElement, document.body.firstChild);
    }
    
}

function getOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "configurator-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000"; 

    const form = document.createElement("form");
    form.style.background = "#fff";
    form.style.padding = "15px";
    form.style.borderRadius = "8px";

    const heading = document.createElement("h2");
    heading.textContent = "Konfigurátor hry"; // Replace with your desired heading
    heading.style.padding = "0";
    heading.style.margin = 0;
    heading.style.marginBottom = "10px";
    form.appendChild(heading);

    const dropdown = document.createElement("select");
    dropdown.name = "dropdownField";
    dropdown.style.width = "100%";
    dropdown.style.padding = "5px";
    dropdown.style.marginTop = "5px";
    dropdown.style.marginBottom = "5px";
    form.appendChild(dropdown);

    // Add options to the dropdown
    const option1 = document.createElement("option");
    option1.value = "povrch.json";
    option1.textContent = "Povrch (povrch.json)";
    dropdown.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = "vodstvo.json";
    option2.textContent = "Vodstvo (vodstvo.json)";
    dropdown.appendChild(option2);

    const option3 = document.createElement("option");
    option3.value = "world.json";
    option3.textContent = "Světová města (world.json)";
    dropdown.appendChild(option3);

    // Add your form fields here
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.name = "fieldName";
    inputField.placeholder = "Počet pojmů";
    form.appendChild(inputField);

    const examinationCheckbox = document.createElement("input");
    examinationCheckbox.type = "checkbox";
    examinationCheckbox.name = "examinationMode";
    examinationCheckbox.id = "examinationMode";
    examinationCheckbox.style.marginBottom = "5px";
    examinationCheckbox.style.display = "inline-block"; 
    form.appendChild(examinationCheckbox);

    const label = document.createElement("label");
    label.textContent = "Mód testu";
    label.htmlFor = "examinationMode";
    label.style.display = "inline-block"; 
    label.style.verticalAlign = "middle"; 
    form.appendChild(label);

    // Add a line break for visual separation
    const lineBreak = document.createElement("br");
    form.appendChild(lineBreak); 

    // Add a line break for visual separation
    form.appendChild(lineBreak);

    // Add username input field (hidden by default)
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";
    usernameInput.id = "usernameField";
    usernameInput.placeholder = "Uživatelské jméno";
    usernameInput.style.display = "none"; // Initially hidden
    form.appendChild(usernameInput);

    // Add support question mark
    const supportIcon = document.createElement("div");
    supportIcon.className = "support-icon"
    supportIcon.textContent = "Kde to jsem?";
    supportIcon.style.position = "absolute";
    supportIcon.style.top = "10px";
    supportIcon.style.left = "10px";
    supportIcon.style.cursor = "pointer";
    supportIcon.style.fontWeight = "bold";
    supportIcon.style.fontSize = "24px";
    supportIcon.style.marginRight = "10px"
    supportIcon.style.color = "#000000"; // Adjust the color to your preference
    overlay.appendChild(supportIcon);

    // Add instructions div (initially hidden)
    const instructionsDiv = document.createElement("div");
    instructionsDiv.innerHTML = `Pomocí <i>config=true</i> jsi otevřel konfigurační menu hry, pomůže ti hru připravit.<br>
    <ul>
        <li> • počet pojmů nastaví, kolik termínu na své slepé mapě chceš</li>
        <li> • mód testu ti na konci vystaví certifikát a umožní přidat jméno</li>
        <li> • také můžeš vybrat, jakou slepou mapu chceš hrát pomocí menu</li>
    </ul>
  `;
    instructionsDiv.style.position = "absolute";
    instructionsDiv.style.top = "42px";
    instructionsDiv.style.left = "10px";
    instructionsDiv.style.background = "#fff";
    instructionsDiv.style.padding = "5px";
    instructionsDiv.style.border = "1px solid #000";
    instructionsDiv.style.borderRadius = "5px";
    instructionsDiv.style.display = "none";
    instructionsDiv.style.width = 90%
    overlay.appendChild(instructionsDiv);

    // Conditionally show/hide username input field
    examinationCheckbox.addEventListener("change", function() {
        if (examinationCheckbox.checked) {
            usernameInput.style.display = "block";
        } else {
            usernameInput.style.display = "none";
        }
    });

    // Add event listeners to show and hide instructions on mobile
    supportIcon.addEventListener("mouseover", function() {
        instructionsDiv.style.display = "block";
    });
    
    supportIcon.addEventListener("mouseout", function() {
        instructionsDiv.style.display = "none";
    });

    // Add event listeners to show and hide instructions on mobile
    supportIcon.addEventListener("touchstart", function() {
        instructionsDiv.style.display = "block";
    });
    
    supportIcon.addEventListener("touchend", function() {
        instructionsDiv.style.display = "none";
    });

    // Add event listeners to open and close the instructionsDiv.
    supportIcon.addEventListener("click", function() {
        instructionsDiv.style.display = "block";
    });
    
    document.addEventListener("click", function(event) {
        if (event.target !== supportIcon && event.target !== instructionsDiv) {
        instructionsDiv.style.display = "none";
        }
    });

    // Add a line break before the submit button
    form.appendChild(document.createElement("br"));

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Budiž!";
    form.appendChild(submitButton);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        const fieldValue = formData.get("fieldName");
        userName = formData.get("username");
        limitPoiIndex = parseInt(fieldValue);
        examinationModeControl = formData.get("examinationMode") === "on";
        // Get the current URL
        var currentURL = window.location.href;

        // Find the position of the first question mark
        const questionMarkIndex = currentURL.indexOf("?");

        // Extract the portion before the question mark
        currentURL = questionMarkIndex !== -1 ? currentURL.substring(0, questionMarkIndex) : currentURL;

        const jsonFile = dropdown.value;

        window.open(`${currentURL}?json=${jsonFile}&max=${limitPoiIndex}&user=${userName}&exam=${examinationModeControl}`,"_self")
        if (!examinationModeControl) {
            var bottomLeftElement = document.getElementById('buymeacoffee');
            bottomLeftElement.style.display = 'flex';
        }

        // Close the overlay after submission
        document.body.removeChild(overlay);
        accuracyWarning()
    });

    overlay.appendChild(form);

    document.body.appendChild(overlay);
}


accuracyWarning()
if (queryStringParams.get("config") === "true") {
    getOverlay();
}

if (examinationModeControl === false && queryStringParams.get("config") !== "true") {
    var bottomLeftElement = document.getElementById('buymeacoffee');
    bottomLeftElement.style.display = 'flex';
} else {
    var bottomLeftElement = document.getElementById('buymeacoffee');
    bottomLeftElement.style.display = 'flex';
    bottomLeftElement.innerHTML = "verze pro pana Pavlíčka"
    bottomLeftElement.style.paddingBottom = "7px"
}

console.log(gameName);
pageName = "Slepá mapa - " + gameName
if (limitPoiIndex != null) {
    if (limitPoiIndex == 1) {
        inflectedPojem = "pojem"
    } else if (limitPoiIndex >= 2 && limitPoiIndex <5) {
        inflectedPojem = "pojmy"
    } else {
        inflectedPojem = "pojmů"
    }

    pageName = "Slepá mapa - " + gameName + " - " + limitPoiIndex + " " + inflectedPojem;
}
document.getElementById('page-name').innerHTML += pageName;

var zoom;

console.log(jsonFile)
if (jsonFile == 'world.json') {
    minZoom = 1
    maxZoom = 4
} else {
    maxZoom = 9
    minZoom = 5
}

var map = L.map('map', {
    minZoom: minZoom,
}).setView([50.0, 15.5], 7);

map.setMaxBounds(  [[-90,-180],   [90,180]]  )
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: maxZoom,
}).addTo(map);

var marker;
var currentPoiIndex = 0;
var actualCoords;
var poiList; // Declare poiList globally
var previousPoiName = '';



function onMapClick(e) {
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker(e.latlng).addTo(map);
}
map.on('click', onMapClick);
var lastMarker = [];
var lastPOI = []
var lastLine = []
const maxPins = 5
var userGuess = []
var badGuesses = []

function sumFloats(floatList) {
    let sum = 0;

    for (let i = 0; i < floatList.length; i++) {
        sum += parseFloat(floatList[i]);
    }

    return sum;
}

function averageFloats(floatList) {
    const totalSum = sumFloats(floatList);
    const numberOfFloats = floatList.length;
    
    return totalSum / numberOfFloats;
}

function getMarkSchool(result) {
    if (result < 12) {return 1}
    if (result < 24) {return 2}
    if (result < 36) {return 3}
    if (result < 48) {return 4}
    if (result > 48) {return 5}

}


function generateCertificatePDF(averageDistance, timeElapsed, jsonFile, limitPoiIndex) {
    var doc = new jspdf.jsPDF('p', 'pt', 'A4');
    // Assuming the font files are in a 'fonts' folder in your project
    doc.addFont('Inter.ttf', 'Inter', 'normal');
    doc.setFont('Inter');
    doc.setFontSize(24); // Set font size to 12 points
    doc.setTextColor(0, 0, 0); // Set text color to black


    doc.text(`Certifikát o splnění`, 70, 40);
    doc.setFontSize(16);
    doc.text(`Tímto souborem se stvrzuje, že ` + userName + ` dohrál hru "Slepý zemák".`, 30, 80);
    doc.text(`Průměrná odchylka: ${Math.round(averageDistance)} kilometrů`, 30, 120);
    doc.text(`Celkový čas: ${(timeElapsed)/1000} sekund`, 30, 140);
    doc.text(`Vydáno dne: ${new Date().toLocaleDateString()}`, 30, 160);

    doc.text(`Herní json: ${jsonFile}`, 30, 200);
    doc.text(`Celkem pojmů: ${limitPoiIndex}`, 30, 220);
    doc.text(`Autentikační hash: ${(Date.now()*(Math.round(averageDistance)+Math.round(timeElapsed/1000))).toString(16)}`, 30, 350);

    return doc;
}

function downloadCertificatePDF(averageDistance, timeElapsed, jsonFile, limitPoiIndex) {
    const doc = generateCertificatePDF(averageDistance, timeElapsed, jsonFile, limitPoiIndex);
    doc.save('certifikát.pdf');
}

function submitGuess() {
    if (marker) {
        var guessCoords = marker.getLatLng();
        var distance = calculateDistance(guessCoords, actualCoords);
        document.getElementById('result').innerHTML = 'a tvůj odhad byl asi <b>' + distance.toFixed(1) + '</b> kilometrů od cíle,';
        var currentPoi = document.getElementById('poi-name').innerHTML;
        console.log(distance, currentPoi);
        if (distance.toFixed(1) > 25) {
            badGuesses.push(currentPoi)
        }
        // Update how many POI's are left in session
        if (((limitPoiIndex - currentPoiIndex) == 1) || ((poiList.length - currentPoiIndex) == 1)) {
            document.getElementById('left-over').innerHTML =  ""
        } else if (limitPoiIndex != null) {
            document.getElementById('left-over').innerHTML =  "a zbývá ti " + (limitPoiIndex - currentPoiIndex - 1) + " pojmů."
        } else if ((limitPoiIndex == null) && ((poiList.length - currentPoiIndex) != 1))   {
            document.getElementById('left-over').innerHTML =  "a zbývá ti " + (poiList.length - currentPoiIndex - 1) + " pojmů."
        }
        userGuess[currentPoiIndex] = distance.toFixed(1);
        if (lastMarker.length > maxPins) {
            map.removeLayer(lastMarker[currentPoiIndex-maxPins]);
        } 
        if (lastPOI.length > maxPins) {
            map.removeLayer(lastPOI[currentPoiIndex-maxPins]);
        } 
        if (lastLine.length > maxPins) {
            map.removeLayer(lastLine[currentPoiIndex-maxPins]);
        } 
        lastMarker[currentPoiIndex] = L.marker(guessCoords).addTo(map);
        lastPOI[currentPoiIndex] = L.marker(actualCoords, {
            icon: L.divIcon({
                className: 'poi-marker'
            })
        }).addTo(map);
        lastLine[currentPoiIndex] = L.polyline([guessCoords, actualCoords], {
            color: 'blue', // You can change the color to your preference
            dashArray: '5, 10' // This sets the dash pattern to 5 pixels on, 10 pixels off
        }).addTo(map);
        currentPoiIndex++;

        result = averageFloats(userGuess);
        const endTime = Date.now(); 
        const elapsedTime = endTime - startTime;
        var markSchool = getMarkSchool(result);
        console.log(jsonFile, limitPoiIndex);
        if (examinationModeControl === true) { 
            message = `
            <br><br>
            Konec, průměrná odchylka <b>${result.toFixed(1)}</b> kilometrů od cíle.<br><br>
            A celkem ti to trvalo ${(elapsedTime/1000)} sekund!<br><br>
            <button onclick="downloadCertificatePDF(${result}, ${elapsedTime}, '${jsonFile}', ${limitPoiIndex})">Stáhnout certifikát (PDF)</button>
        `;
        }
    
        if (examinationModeControl === false) {
            message = "<br><br>Konec, průměrná odchylka <b>" + result.toFixed(1) + "</b> kilometrů od cíle, <br>za to by ti Pavlíček dal tak za " + markSchool + ".";
        }

        if (badGuesses.length > 10) {
            message = "<br><br><b> Whoah, uč se radši!</b>" + message
        }
        if (currentPoiIndex == limitPoiIndex) {
            message = message + "<br><br>Nejvíce ti nešly: " + badGuesses.join(', ');
        }
        
        if (currentPoiIndex == limitPoiIndex || currentPoiIndex >= poiList.length) {
            document.getElementById('result').innerHTML += message;
        } else {
            setNewPoi();
        }
    } else {
        document.getElementById('result').innerHTML = 'Please set a pin on the map first.';
    }
}

function calculateDistance(guessCoords, actualCoords) {
    return L.latLng(guessCoords).distanceTo(actualCoords) / 1000;
}

function setNewPoi() {
    if (marker) {
        map.removeLayer(marker);
    }

    // Store the current term as the previous term
    previousPoiName = document.getElementById('poi-name').innerHTML;

    var currentPoi = poiList[currentPoiIndex];
    actualCoords = currentPoi[1];
    console.log(currentPoi);
    document.getElementById('previous-poi').innerHTML = previousPoiName;
    console.log("Printing POI...");
    try {
    var mountainHeight = currentPoi[1][2].find(item => typeof item === 'number');
    if (mountainHeight) {
        document.getElementById('poi-name').innerHTML = currentPoi[0] + " - " + mountainHeight + " m. n. m";
    } else {
        document.getElementById('poi-name').innerHTML = currentPoi[0];
    } 
    
    } catch {
        document.getElementById('poi-name').innerHTML = currentPoi[0];
    }

    mountainHeight = currentPoi[3]

    function intepretPoi(poiType) {
        if (Array.isArray(poiType)) {
            poiType = poiType[0]; // Pick the first value from the list
        }
        const translations = {
            "river": "řeku",
            "řeka": "řeku",
            "water": "rybník",
            "dam": "přehradu",
            "lake": "jezero",
            "přehrada": "přehradu",
            "pahorkatina": "pahorkatinu",
            "hora": "horu",
            "nížina": "nížinu",
            "brána": "bránu"
          };

        return translations[poiType] || poiType;
        }
    document.getElementById('poi-type').innerHTML = intepretPoi(currentPoi[1][2]); // Access 'type' from currentPoi[1]
  }
  

// Move the code that is trying to access the poiList variable inside of the then() callback
const submitButton = document.getElementById('submitGuess');
submitButton.addEventListener('click', submitGuess);

fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
        poiList = Object.entries(data).map(entry => {
            return [entry[0], [entry[1].latitude, entry[1].longitude, entry[1].type]];
        });

        // Randomize the order of poiList
        poiList = shuffleArray(poiList);

        // Move the code that is trying to access the poiList variable inside of the then() callback
        setNewPoi();
    })
    .catch(error => console.error('Error loading coordinates:', error));
    
// Function to shuffle an array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener('DOMContentLoaded', function() {
    const poiNameElement = document.getElementById('poi-name');

    poiNameElement.addEventListener('click', function() {
        const poiName = this.innerText; // Get the text content of #poi-name

        // Open mapy.cz with the query
        window.open(`https://mapy.cz/?q=${encodeURIComponent(poiName)}`);
    });

    const previousPoiElement = document.getElementById('previous-poi');
    previousPoiElement.addEventListener('click', function() {
        const previousPoiName = this.innerText; // Get the text content of #previous-poi

        // Open mapy.cz with the query of the previous term
        window.open(`https://mapy.cz/?q=${encodeURIComponent(previousPoiName)}`);
    });
});

function hideAllElementsExcept(elementId) {
    const elements = document.querySelectorAll("*");
    for (const element of elements) {
      if (element.id !== elementId) {
        element.style.display = "none";
      }
    }
  }

window.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth < 320) {
        var warningElement = document.createElement('div');
        warningElement.textContent = 'Varování: Stránka je optimalizovaná pro větší obrazovky.';
        warningElement.style.backgroundColor = 'red';
        warningElement.style.color = 'white';
        warningElement.style.padding = '10px';
        warningElement.style.textAlign = 'center';
        document.body.insertBefore(warningElement, document.body.firstChild);
    }
    if (window.innerWidth < 200) {
        var moveElement = document.createElement('div');
        moveElement.textContent = 'Přejdi na větší zařízení.';
        moveElement.style.display = "flex!important"
        moveElement.style.backgroundColor = 'red';
        moveElement.style.color = 'white';
        moveElement.style.padding = '10px';
        moveElement.style.textAlign = 'center';
        moveElement.style.display = 'block';
        document.body.insertBefore(moveElement, document.body.firstChild);
        moveElement.id = "myElement"
        hideAllElementsExcept("myElement")
    }
});
  