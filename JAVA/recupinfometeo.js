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

function afficherMétéo(données) {
    const infoMétéo = document.getElementById('weatherInfo');
    const joursDemandés = parseInt(document.getElementById('daysSelect').value) || 1;
    const aujourdHui = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    let html = `<h2>Météo pour ${données.city.name}</h2>`;
    html += `<div class="weather-cards">`;

    données.forecast.slice(0, joursDemandés).forEach((prévision, index) => {
        const dateDuJour = new Date(aujourdHui);
        dateDuJour.setDate(aujourdHui.getDate() + index);
        const dateFormatée = dateDuJour.toLocaleDateString('fr-FR', options);

        html += `
            <div class="weather-card">
                <h3>${dateFormatée}</h3>
                <div class="weather-details">
                    <p><span class="label">Min :</span> ${prévision.tmin}°C</p>
                    <p><span class="label">Max :</span> ${prévision.tmax}°C</p>
                    <p><span class="label">Pluie :</span> ${prévision.probarain}%</p>
                    <p><span class="label">Ensoleillement :</span> ${prévision.sun_hours} h</p>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    infoMétéo.innerHTML = html;
}
