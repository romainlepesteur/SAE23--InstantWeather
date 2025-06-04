
document.getElementById('formulaireMeteo').addEventListener('submit', function(evenement) {
    evenement.preventDefault();
    const codePostal = document.getElementById('codePostal').value.trim();
    const motifCodePostal = /^\d{5}$/;
    if (!motifCodePostal.test(codePostal)) {
        alert('Veuillez entrer un code postal valide de 5 chiffres.');
        return;
    }
    recupererCommunes(codePostal);
});

function recupererCommunes(codePostal) {
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Erreur réseau ou serveur');
            }
            return reponse.json();
        })
        .then(donnees => afficherCommunes(donnees))
        .catch(erreur => {
            console.error('Erreur lors de la récupération des communes :', erreur);
            alert('Impossible de récupérer les communes. Vérifiez votre connexion.');
        });
}

function afficherCommunes(communes) {
    const selectVille = document.getElementById('selectVille');
    const selectJours = document.getElementById('selectJours');

    selectVille.innerHTML = '<option value="">--Sélectionnez une ville--</option>';

    if (communes.length > 0) {
        communes.forEach(commune => {
            const option = document.createElement('option');
            option.value = commune.code;
            option.textContent = commune.nom;
            selectVille.appendChild(option);
        });
        selectVille.style.display = 'block';
        selectJours.style.display = 'block';
    } else {
        alert('Aucune commune trouvée pour ce code postal.');
        selectVille.style.display = 'none';
        selectJours.style.display = 'none';
    }
}


document.getElementById('selectVille').addEventListener('change', function() {
    const codeVilleSelectionnee = this.value;
    if (codeVilleSelectionnee) {
        recupererMeteo(codeVilleSelectionnee);
    }
});


document.getElementById('selectJours').addEventListener('change', function() {
    const codeVilleSelectionnee = document.getElementById('selectVille').value;
    if (codeVilleSelectionnee) {
        recupererMeteo(codeVilleSelectionnee);
    }
});


document.querySelectorAll('#optionsSelect input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', function() {
        const codeVilleSelectionnee = document.getElementById('selectVille').value;
        if (codeVilleSelectionnee) {
            recupererMeteo(codeVilleSelectionnee);
        }
    });
});


document.getElementById('basculerSombre').addEventListener('change', function() {
    document.body.classList.toggle('dark', this.checked);
});


