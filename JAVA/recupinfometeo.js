// Fonction pour récupérer les données météorologiques d'une commune
function récupérerMétéo(codeCommune) {
    const cléAPI = '3f5edb23a4c5fd475f199e84bf09ed8fb6cd85e636b7951360a5e3b3ce5cfb24';
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

// Fonction pour afficher la météo pour 1 à 7 jours
function afficherMétéo(données) {
    const infoMétéo = document.getElementById('weatherInfo');
    const joursDemandés = parseInt(document.getElementById('daysSelect').value) || 1;
    const aujourdHui = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let html = `<h2>Météo pour ${données.city.name}</h2>`;

    données.forecast.slice(0, joursDemandés).forEach((prévision, index) => {
        const dateDuJour = new Date(aujourdHui);
        dateDuJour.setDate(aujourdHui.getDate() + index);
        const dateFormatée = dateDuJour.toLocaleDateString('fr-FR', options);

        html += `
            <div class="forecast-day" style="margin-top:15px; padding:10px; border-top:1px solid rgba(255,255,255,0.3);">
                <h3>Le ${dateFormatée}</h3>
                <p>Température minimale : ${prévision.tmin}°C</p>
                <p>Température maximale : ${prévision.tmax}°C</p>
                <p>Probabilité de pluie : ${prévision.probarain}%</p>
                <p>Heures d'ensoleillement : ${prévision.sun_hours} heures</p>
            </div>
        `;
    });

    infoMétéo.innerHTML = html;
}
