
document.getElementById('weatherForm').addEventListener('submit', function(événement) {
    événement.preventDefault();
    const codePostal = document.getElementById('postalCode').value.trim();
    const motifCodePostal = /^\d{5}$/;
    if (!motifCodePostal.test(codePostal)) {
        alert('Veuillez entrer un code postal valide de 5 chiffres.');
        return;
    }
    récupérerCommunes(codePostal);
});

function récupérerCommunes(codePostal) {
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`)
        .then(réponse => {
            if (!réponse.ok) {
                throw new Error('Erreur réseau ou serveur');
            }
            return réponse.json();
        })
        .then(données => afficherCommunes(données))
        .catch(erreur => {
            console.error('Erreur lors de la récupération des communes :', erreur);
            alert('Impossible de récupérer les communes. Vérifiez votre connexion.');
        });
}

function afficherCommunes(communes) {
    const sélecteurVille = document.getElementById('citySelect');
    const sélecteurJours = document.getElementById('daysSelect');

    sélecteurVille.innerHTML = '<option value="">--Sélectionnez une ville--</option>';

    if (communes.length > 0) {
        communes.forEach(commune => {
            const option = document.createElement('option');
            option.value = commune.code;
            option.textContent = commune.nom;
            sélecteurVille.appendChild(option);
        });
        sélecteurVille.style.display = 'block';
        sélecteurJours.style.display = 'block';
    } else {
        alert('Aucune commune trouvée pour ce code postal.');
        sélecteurVille.style.display = 'none';
        sélecteurJours.style.display = 'none';
    }
}


document.getElementById('citySelect').addEventListener('change', function() {
    const codeVilleSélectionnée = this.value;
    if (codeVilleSélectionnée) {
        récupérerMétéo(codeVilleSélectionnée);
    }
});


document.getElementById('daysSelect').addEventListener('change', function() {
    const codeVilleSélectionnée = document.getElementById('citySelect').value;
    if (codeVilleSélectionnée) {
        récupérerMétéo(codeVilleSélectionnée);
    }
});


document.querySelectorAll('#optionsSelect input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', function() {
        const codeVilleSélectionnée = document.getElementById('citySelect').value;
        if (codeVilleSélectionnée) {
            récupérerMétéo(codeVilleSélectionnée);
        }
    });
});
