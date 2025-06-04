function recupererMeteo(codeCommune) {
    const cleAPI = '0eade8e30618633d6cba79a970df3ff40cec620e51c99caa28e592026b3fcf33';
    fetch(`https://api.meteo-concept.com/api/forecast/daily?insee=${codeCommune}&token=${cleAPI}`)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Erreur réseau ou serveur');
            }
            return reponse.json();
        })
        .then(donnees => afficherMeteo(donnees))
        .catch(erreur => {
            console.error('Erreur lors de la récupération des données météo :', erreur);
            document.getElementById('infosMeteo').textContent = 'Erreur lors de la récupération des données météo.';
        });
}

function afficherMeteo(donnees) {
    const infosMeteo = document.getElementById('infosMeteo');
    const joursDemandes = parseInt(document.getElementById('selectJours').value) || 1;
    const aujourdHui = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


    const afficherLatitude = document.getElementById('optLatitude').checked;
    const afficherLongitude = document.getElementById('optLongitude').checked;
    const afficherProbabilitePluie = document.getElementById('optProbabilitePluie').checked;
    const afficherVitesseVent = document.getElementById('optVitesseVent').checked;
    const afficherRafaleVent = document.getElementById('optRafaleVent').checked;
    const afficherCumulPluie = document.getElementById('optCumulPluie').checked;

    let html = `<h2>Météo pour ${donnees.city.name}</h2>`;
    html += `<div class="weather-cards">`;

    donnees.forecast.slice(0, joursDemandes).forEach((prevision, index) => {
        const dateDuJour = new Date(aujourdHui);
        dateDuJour.setDate(aujourdHui.getDate() + index);
        const dateFormatee = dateDuJour.toLocaleDateString('fr-FR', options);

        html += `<div class="weather-card">
                <h3>${dateFormatee}</h3>
                <div class="weather-details">`;

        if (afficherLatitude)       html += `<p><span class="label">Latitude :</span> ${donnees.city.latitude}</p>`;
        if (afficherLongitude)      html += `<p><span class="label">Longitude :</span> ${donnees.city.longitude}</p>`;
        if (afficherProbabilitePluie) html += `<p><span class="label">Probabilité de pluie :</span> ${prevision.probarain}%</p>`;
        if (afficherVitesseVent)    html += `<p><span class="label">Vitesse du vent :</span> ${prevision.wind10m} km/h</p>`;
        if (afficherRafaleVent)     html += `<p><span class="label">Rafale de vent :</span> ${prevision.gust10m} km/h</p>`;
        if (afficherCumulPluie)     html += `<p><span class="label">Cumul de pluie :</span> ${prevision.rr10} mm</p>`;

        html += `</div></div>`;
    });

    html += `</div>`;
    infosMeteo.innerHTML = html;
}

