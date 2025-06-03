function récupérerMétéo(codeCommune) {
    const cléAPI = '0eade8e30618633d6cba79a970df3ff40cec620e51c99caa28e592026b3fcf33';
    fetch(`https://api.meteo-concept.com/api/forecast/daily?insee=${codeCommune}&token=${cléAPI}`)
        .then(réponse => {
            if (!réponse.ok) {
                throw new Error('Erreur réseau ou serveur');
            }
            return réponse.json();
        })
        .then(données => afficherMétéo(données))
        .catch(erreur => {
            console.error('Erreur lors de la récupération des données météo :', erreur);
            document.getElementById('weatherInfo').textContent = 'Erreur lors de la récupération des données météo.';
        });
}

function afficherMétéo(données) {
    const infoMétéo = document.getElementById('weatherInfo');
    const joursDemandés = parseInt(document.getElementById('daysSelect').value) || 1;
    const aujourdHui = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Cases à cocher
    const showLat = document.getElementById('optLat').checked;
    const showLon = document.getElementById('optLon').checked;
    const showRainProb = document.getElementById('optRainProb').checked;
    const showWind = document.getElementById('optWind').checked;
    const showGust = document.getElementById('optGust').checked;
    const showRainSum = document.getElementById('optRainSum').checked;

    let html = `<h2>Météo pour ${données.city.name}</h2>`;
    html += `<div class="weather-cards">`;

    données.forecast.slice(0, joursDemandés).forEach((prévision, index) => {
        const dateDuJour = new Date(aujourdHui);
        dateDuJour.setDate(aujourdHui.getDate() + index);
        const dateFormatée = dateDuJour.toLocaleDateString('fr-FR', options);

        html += `<div class="weather-card">
                <h3>${dateFormatée}</h3>
                <div class="weather-details">`;

        if (showLat)      html += `<p><span class="label">Latitude :</span> ${données.city.latitude}</p>`;
        if (showLon)      html += `<p><span class="label">Longitude :</span> ${données.city.longitude}</p>`;
        if (showRainProb) html += `<p><span class="label">Prob. de pluie :</span> ${prévision.probarain}%</p>`;
        if (showWind)     html += `<p><span class="label">Vent moyen :</span> ${prévision.wind10m} km/h</p>`;
        if (showGust)     html += `<p><span class="label">Rafale max :</span> ${prévision.gust10m} km/h</p>`;
        if (showRainSum)  html += `<p><span class="label">Cumul de pluie :</span> ${prévision.rr10} mm</p>`;

        html += `</div></div>`;
    });

    html += `</div>`;
    infoMétéo.innerHTML = html;
}

