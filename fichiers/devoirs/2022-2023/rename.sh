#!/bin/bash

# Répertoire contenant les liens symboliques
repertoire_liens="."

# Répertoire cible
repertoire_cible="/home/renaud/travail/mpsi/devoirs/2022-2023"

# Parcourir les liens symboliques dans le répertoire
for lien_symbolique in "$repertoire_liens"/*; do
    # Vérifier si le chemin est un lien symbolique
    if [ -L "$lien_symbolique" ]; then
        # Obtenir le nom du fichier cible actuel du lien symbolique
        cible_actuelle=$(readlink "$lien_symbolique")
        
        # Construire le nouveau chemin complet de la cible dans le répertoire cible
        nouveau_chemin_complet="$repertoire_cible/$(basename "$cible_actuelle")"
        
        # Mettre à jour le lien symbolique pour qu'il pointe vers le nouveau chemin
        ln -sf "$nouveau_chemin_complet" "$lien_symbolique"
        
        echo "Le lien symbolique $lien_symbolique a été mis à jour pour pointer vers $nouveau_chemin_complet"
    fi
done
